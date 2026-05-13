import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('franchise_owners')
      .select('branch_name, franchise_name')
      .order('branch_name');

    if (error) throw error;

    // Format as "City — Branch" if possible, or just Branch Name
    const branches = (data || []).map((b: any) => {
      if (b.franchise_name && b.branch_name) {
        return `${b.franchise_name} — ${b.branch_name}`;
      }
      return b.branch_name || b.franchise_name;
    }).filter(Boolean);

    // Add "All Branches" as the first option and remove duplicates
    const uniqueBranches = Array.from(new Set(["All Branches", ...branches]));

    return NextResponse.json(uniqueBranches);
  } catch (error: any) {
    console.error("Fetch branches error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
