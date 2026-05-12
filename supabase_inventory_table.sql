-- =====================================================
-- Inventory & Procurement Module
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Product inventory tracking per branch
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,                -- e.g. 'Keratin', 'Color', 'Treatment', 'Tools'
  branch_location TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_threshold INTEGER NOT NULL DEFAULT 10,   -- reorder point
  max_capacity INTEGER NOT NULL DEFAULT 100,
  unit TEXT DEFAULT 'units',                    -- e.g. 'units', 'ml', 'grams'
  unit_cost DECIMAL(10,2) DEFAULT 0,
  supplier TEXT,
  last_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Procurement orders log
CREATE TABLE IF NOT EXISTS procurement_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  branch_location TEXT NOT NULL,
  quantity_ordered INTEGER NOT NULL,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ordered', 'delivered', 'cancelled')),
  reason TEXT,                                  -- why this order was created
  ordered_by TEXT DEFAULT 'auto-procurement',   -- 'auto-procurement' or user name
  estimated_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory(branch_location);
CREATE INDEX IF NOT EXISTS idx_inventory_stock ON inventory(current_stock);
CREATE INDEX IF NOT EXISTS idx_procurement_status ON procurement_orders(status);
CREATE INDEX IF NOT EXISTS idx_procurement_created ON procurement_orders(created_at DESC);

-- RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to procurement" ON procurement_orders FOR ALL USING (true) WITH CHECK (true);

-- Auto-update timestamps
CREATE OR REPLACE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE OR REPLACE TRIGGER trg_procurement_updated_at
  BEFORE UPDATE ON procurement_orders FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- Seed inventory data
-- =====================================================

INSERT INTO inventory (product_name, category, branch_location, current_stock, min_threshold, max_capacity, unit, unit_cost, supplier) VALUES
  ('Keratin Smoothing Formula', 'Keratin', 'Adyar', 45, 15, 100, 'units', 850.00, 'GK Hair India'),
  ('Keratin Smoothing Formula', 'Keratin', 'RS Puram', 12, 15, 100, 'units', 850.00, 'GK Hair India'),
  ('Keratin Smoothing Formula', 'Keratin', 'Bangalore', 38, 15, 100, 'units', 850.00, 'GK Hair India'),
  ('Botox Follicle Repair Serum', 'Treatment', 'Adyar', 8, 20, 80, 'units', 1200.00, 'L''Oreal Professional'),
  ('Botox Follicle Repair Serum', 'Treatment', 'RS Puram', 22, 20, 80, 'units', 1200.00, 'L''Oreal Professional'),
  ('Botox Follicle Repair Serum', 'Treatment', 'Bangalore', 5, 20, 80, 'units', 1200.00, 'L''Oreal Professional'),
  ('Global Hair Color Mix', 'Color', 'Adyar', 60, 25, 150, 'units', 450.00, 'Wella Professionals'),
  ('Global Hair Color Mix', 'Color', 'RS Puram', 18, 25, 150, 'units', 450.00, 'Wella Professionals'),
  ('Global Hair Color Mix', 'Color', 'Bangalore', 42, 25, 150, 'units', 450.00, 'Wella Professionals'),
  ('Glass Dermal Therapy Kit', 'Treatment', 'Adyar', 30, 10, 50, 'units', 2200.00, 'Dermalogica'),
  ('Glass Dermal Therapy Kit', 'Treatment', 'RS Puram', 15, 10, 50, 'units', 2200.00, 'Dermalogica'),
  ('Pigment Stabilizer Solution', 'Color', 'Adyar', 35, 20, 100, 'ml', 320.00, 'Schwarzkopf'),
  ('Pigment Stabilizer Solution', 'Color', 'RS Puram', 28, 20, 100, 'ml', 320.00, 'Schwarzkopf'),
  ('Pigment Stabilizer Solution', 'Color', 'Bangalore', 40, 20, 100, 'ml', 320.00, 'Schwarzkopf'),
  ('Chemical Re-bonding Agent', 'Treatment', 'Adyar', 55, 10, 80, 'units', 680.00, 'Matrix India'),
  ('Chemical Re-bonding Agent', 'Treatment', 'RS Puram', 48, 10, 80, 'units', 680.00, 'Matrix India');
