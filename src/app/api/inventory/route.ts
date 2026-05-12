import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch inventory with stock alerts + recent procurement orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch"); // optional filter

    // Fetch inventory
    let inventoryQuery = supabaseAdmin
      .from("inventory")
      .select("*")
      .order("product_name");

    if (branch && branch !== "All Branches") {
      inventoryQuery = inventoryQuery.eq("branch_location", branch);
    }

    const { data: inventory, error: invError } = await inventoryQuery;

    if (invError) {
      console.error("Inventory fetch error:", invError);
      // Table may not exist yet — return empty data
      return NextResponse.json({
        alerts: [],
        summary: { criticalCount: 0, lowCount: 0, optimalCount: 0, totalProducts: 0, totalStockValue: 0 },
        recentOrders: [],
        _notice: "Table may not exist yet. Run supabase_inventory_table.sql to set up.",
      });
    }

    // Fetch recent procurement orders
    const { data: orders, error: ordError } = await supabaseAdmin
      .from("procurement_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (ordError) {
      console.error("Procurement orders fetch error:", ordError);
      // procurement_orders table may not exist — continue with empty orders
    }

    const items = inventory || [];

    // Build forecast alerts from real stock data
    const alerts = items.map((item) => {
      const stockRatio = item.current_stock / item.min_threshold;
      let status: "critical" | "low" | "optimal";
      let type: string;
      let reason: string;
      let action: string | null;

      if (item.current_stock <= item.min_threshold * 0.5) {
        status = "critical";
        type = "Critical";
        reason = `Only ${item.current_stock} ${item.unit} left (min: ${item.min_threshold})`;
        const orderQty = item.max_capacity - item.current_stock;
        action = `Procure ${orderQty} ${item.unit} from ${item.supplier || "supplier"}`;
      } else if (item.current_stock <= item.min_threshold) {
        status = "low";
        type = "Restock";
        reason = `Stock at ${item.current_stock}/${item.min_threshold} threshold`;
        const orderQty = Math.ceil((item.max_capacity - item.current_stock) * 0.5);
        action = `Order ${orderQty} ${item.unit} to maintain buffer`;
      } else {
        status = "optimal";
        type = "Optimal";
        reason = `${item.current_stock} ${item.unit} in stock (capacity: ${item.max_capacity})`;
        action = null;
      }

      return {
        id: item.id,
        productName: item.product_name,
        category: item.category,
        branch: item.branch_location,
        currentStock: item.current_stock,
        minThreshold: item.min_threshold,
        maxCapacity: item.max_capacity,
        unit: item.unit,
        unitCost: item.unit_cost,
        supplier: item.supplier,
        stockRatio,
        status,
        type,
        reason,
        action,
      };
    });

    // Summary stats
    const criticalCount = alerts.filter((a) => a.status === "critical").length;
    const lowCount = alerts.filter((a) => a.status === "low").length;
    const optimalCount = alerts.filter((a) => a.status === "optimal").length;
    const totalProducts = items.length;
    const totalStockValue = items.reduce(
      (acc, i) => acc + (i.current_stock || 0) * (i.unit_cost || 0),
      0
    );

    return NextResponse.json({
      alerts: alerts.sort((a, b) => {
        const order = { critical: 0, low: 1, optimal: 2 };
        return order[a.status] - order[b.status];
      }),
      summary: {
        criticalCount,
        lowCount,
        optimalCount,
        totalProducts,
        totalStockValue: Math.round(totalStockValue),
      },
      recentOrders: orders || [],
    });
  } catch (err) {
    console.error("Inventory API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create procurement order and update stock
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "auto-procure") {
      // Find all items below threshold
      const { data: lowStock, error: fetchErr } = await supabaseAdmin
        .from("inventory")
        .select("*")
        .or(`current_stock.lte.${0}`); // we'll filter in JS for flexibility

      if (fetchErr) {
        return NextResponse.json({ error: fetchErr.message }, { status: 500 });
      }

      // Actually fetch ALL and filter properly
      const { data: allItems, error: allErr } = await supabaseAdmin
        .from("inventory")
        .select("*");

      if (allErr) {
        return NextResponse.json({ error: allErr.message }, { status: 500 });
      }

      const needsRestock = (allItems || []).filter(
        (item) => item.current_stock <= item.min_threshold
      );

      if (needsRestock.length === 0) {
        return NextResponse.json({
          success: true,
          message: "All inventory levels are optimal. No procurement needed.",
          ordersCreated: 0,
        });
      }

      const orders = [];

      for (const item of needsRestock) {
        const orderQty = item.max_capacity - item.current_stock;
        const totalCost = orderQty * (item.unit_cost || 0);

        // Create procurement order
        const { data: order, error: orderErr } = await supabaseAdmin
          .from("procurement_orders")
          .insert({
            inventory_id: item.id,
            product_name: item.product_name,
            branch_location: item.branch_location,
            quantity_ordered: orderQty,
            unit_cost: item.unit_cost,
            total_cost: totalCost,
            status: "ordered",
            reason: `Auto-procurement: stock (${item.current_stock}) below threshold (${item.min_threshold})`,
            ordered_by: "auto-procurement",
            estimated_delivery: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
          .select()
          .single();

        if (orderErr) {
          console.error("Order creation failed:", orderErr);
          continue;
        }

        // Update inventory stock
        const { error: updateErr } = await supabaseAdmin
          .from("inventory")
          .update({
            current_stock: item.max_capacity,
            last_restocked_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (updateErr) {
          console.error("Stock update failed:", updateErr);
        }

        orders.push(order);
      }

      return NextResponse.json({
        success: true,
        message: `Procurement completed: ${orders.length} orders placed.`,
        ordersCreated: orders.length,
        orders,
        totalCost: orders.reduce((acc, o) => acc + (o?.total_cost || 0), 0),
      });
    }

    // Single item procurement
    const { inventory_id, quantity } = body;

    if (!inventory_id || !quantity) {
      return NextResponse.json(
        { error: "inventory_id and quantity are required" },
        { status: 400 }
      );
    }

    const { data: item, error: itemErr } = await supabaseAdmin
      .from("inventory")
      .select("*")
      .eq("id", inventory_id)
      .single();

    if (itemErr || !item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const totalCost = quantity * (item.unit_cost || 0);

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("procurement_orders")
      .insert({
        inventory_id: item.id,
        product_name: item.product_name,
        branch_location: item.branch_location,
        quantity_ordered: quantity,
        unit_cost: item.unit_cost,
        total_cost: totalCost,
        status: "ordered",
        reason: `Manual procurement request`,
        ordered_by: "admin",
        estimated_delivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .select()
      .single();

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 });
    }

    // Update stock
    await supabaseAdmin
      .from("inventory")
      .update({
        current_stock: item.current_stock + quantity,
        last_restocked_at: new Date().toISOString(),
      })
      .eq("id", inventory_id);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Inventory POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
