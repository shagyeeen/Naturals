-- ============================================
-- NATURALS AI - DATABASE SCHEMA
-- Hierarchy: franchise_owner > admin > stylist > customer
-- Last synced: 2026-05-09
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('franchise_owner', 'admin', 'stylist', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percentage', 'flat');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Customer Preference ENUMs
DO $$ BEGIN
    CREATE TYPE hairwash_timing AS ENUM ('Before SPA', 'After SPA', 'Both');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE water_temp_pref AS ENUM ('Cold', 'Lukewarm', 'Warm');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE massage_intensity AS ENUM ('Soft', 'Medium', 'Strong', 'None');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE conversation_level AS ENUM ('Quiet Professional', 'Friendly Chat', 'Social/Engaging');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================
-- 1. USERS TABLE
-- Central auth table — extends Supabase auth.users
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id     UUID UNIQUE,
    email       TEXT UNIQUE NOT NULL,
    phone       TEXT,
    role        user_role NOT NULL DEFAULT 'customer',
    full_name   TEXT,
    gender      gender_type,
    location    TEXT,                -- Branch location e.g. "Adyar" — used to auto-assign franchise
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FRANCHISE OWNERS TABLE
-- Top of hierarchy — 1 owner = 1 branch
-- ============================================

CREATE TABLE IF NOT EXISTS public.franchise_owners (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,
    franchise_name  TEXT NOT NULL,
    branch_name     TEXT,
    branch_address  TEXT,
    logo_url        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ADMINS TABLE
-- Operational managers under a franchise owner
-- ============================================

CREATE TABLE IF NOT EXISTS public.admins (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    franchise_owner_id  UUID REFERENCES public.franchise_owners(id) ON DELETE SET NULL,
    branch_location     TEXT,
    full_name           TEXT NOT NULL,
    phone               TEXT NOT NULL,
    email               TEXT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. STYLISTS TABLE
-- Employed under a franchise owner
-- ============================================

CREATE TABLE IF NOT EXISTS public.stylists (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    franchise_owner_id  UUID REFERENCES public.franchise_owners(id) ON DELETE SET NULL,
    branch_location     TEXT,
    full_name           TEXT NOT NULL,
    phone               TEXT NOT NULL,
    email               TEXT,
    gender              gender_type,
    experience_years    INTEGER DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CUSTOMERS TABLE
-- End users — admins book on their behalf
-- ============================================

CREATE TABLE IF NOT EXISTS public.customers (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    customer_code               TEXT UNIQUE,
    full_name                   TEXT NOT NULL,
    phone                       TEXT NOT NULL,
    email                       TEXT,
    date_of_birth               DATE,
    gender                      gender_type,
    hairstyle_preference        TEXT,
    ai_hairstyle_analysis       JSONB,
    preferred_branch_location   TEXT,
    preferred_salon_id          UUID REFERENCES public.franchise_owners(id) ON DELETE SET NULL,
    notes                       TEXT,
    is_active                   BOOLEAN DEFAULT TRUE,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. CUSTOMER PREFERENCES TABLE
-- Personalised salon experience settings per customer
-- ============================================

CREATE TABLE IF NOT EXISTS public.customer_preferences (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id             UUID UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,

    hairwash_preference     hairwash_timing DEFAULT 'Both',
    preferred_hairstyle     TEXT,
    water_temperature       water_temp_pref DEFAULT 'Lukewarm',
    scalp_massage_intensity massage_intensity DEFAULT 'Medium',
    conversation_level      conversation_level DEFAULT 'Friendly Chat',
    special_instructions    TEXT,

    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. SERVICES TABLE
-- Catalogue of all salon services
-- ============================================

CREATE TABLE IF NOT EXISTS public.services (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    TEXT NOT NULL,
    description             TEXT,
    category                TEXT,
    gender_applicability    TEXT DEFAULT 'Both' CHECK (gender_applicability IN ('Women', 'Men', 'Both')),
    duration_minutes        INTEGER NOT NULL DEFAULT 60,
    price                   DECIMAL(10, 2) DEFAULT 0,
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. OFFERS TABLE
-- Promotional discounts with promo codes
-- ============================================

CREATE TABLE IF NOT EXISTS public.offers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_owner_id      UUID REFERENCES public.franchise_owners(id) ON DELETE SET NULL,
    title                   TEXT NOT NULL,
    description             TEXT,
    promo_code              TEXT UNIQUE,
    discount_type           discount_type NOT NULL,
    discount_value          DECIMAL(10, 2) NOT NULL,
    applicable_service_id   UUID REFERENCES public.services(id) ON DELETE SET NULL,
    min_amount              DECIMAL(10, 2) DEFAULT 0,
    valid_from              DATE NOT NULL,
    valid_until             DATE NOT NULL,
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. APPOINTMENTS TABLE
-- Core booking table — admins book on behalf of customers
-- ============================================

CREATE TABLE IF NOT EXISTS public.appointments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    stylist_id          UUID NOT NULL REFERENCES public.stylists(id) ON DELETE RESTRICT,
    service_id          UUID REFERENCES public.services(id) ON DELETE SET NULL,
    booked_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
    offer_id            UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    appointment_date    DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    status              appointment_status DEFAULT 'pending',
    notes               TEXT,
    total_amount        DECIMAL(10, 2),
    discount_amount     DECIMAL(10, 2) DEFAULT 0,
    payment_status      payment_status DEFAULT 'pending',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_appointment_time CHECK (end_time > start_time)
);

-- ============================================
-- 10. STYLIST_SCHEDULE TABLE
-- Weekly availability per stylist
-- ============================================

CREATE TABLE IF NOT EXISTS public.stylist_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stylist_id      UUID NOT NULL REFERENCES public.stylists(id) ON DELETE CASCADE,
    day_of_week     INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (stylist_id, day_of_week)
);

-- ============================================
-- 11. CUSTOMER_HISTORY TABLE
-- Immutable log of customer events
-- ============================================

CREATE TABLE IF NOT EXISTS public.customer_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    action_type     TEXT NOT NULL,
    details         JSONB,
    performed_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_stylist_date    ON public.appointments (stylist_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_status ON public.appointments (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status     ON public.appointments (appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_stylist_schedule_lookup      ON public.stylist_schedule (stylist_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_customer_history_timeline    ON public.customer_history (customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_offers_active                ON public.offers (valid_from, valid_until, is_active);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE TRIGGER trg_franchise_owners_updated_at
    BEFORE UPDATE ON public.franchise_owners FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE TRIGGER trg_admins_updated_at
    BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE TRIGGER trg_stylists_updated_at
    BEFORE UPDATE ON public.stylists FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- AUTO-GENERATE CUSTOMER CODE ON INSERT
-- ============================================

CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.customer_code := 'NAT-' ||
        UPPER(SUBSTRING(NEW.full_name FROM 1 FOR 3)) || '-' ||
        TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
        LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_customer_code
    BEFORE INSERT ON public.customers
    FOR EACH ROW
    WHEN (NEW.customer_code IS NULL)
    EXECUTE FUNCTION generate_customer_code();

-- ============================================
-- AUTO-SYNC ROLE TABLES ON USER INSERT/UPDATE
-- Populates admins/stylists/customers on user insert
-- Updates fields (name, phone, gender) on user update
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_user_role_sync()
RETURNS TRIGGER AS $$
DECLARE
    v_franchise_owner_id UUID;
    v_branch_location    TEXT;
BEGIN
    -- Look up franchise owner by branch_name matching user's location
    SELECT id, branch_name INTO v_franchise_owner_id, v_branch_location
    FROM public.franchise_owners
    WHERE branch_name ILIKE NEW.location
    LIMIT 1;

    -- Fallback: if no match, get first franchise owner
    IF v_franchise_owner_id IS NULL THEN
        SELECT id, branch_name INTO v_franchise_owner_id, v_branch_location
        FROM public.franchise_owners LIMIT 1;
    END IF;

    IF NEW.role = 'franchise_owner' THEN
        INSERT INTO public.franchise_owners (user_id, full_name, phone, email, franchise_name, branch_name)
        VALUES (NEW.id, NEW.full_name, COALESCE(NEW.phone, ''), NEW.email, 'Naturals Salon & Spa', COALESCE(NEW.location, 'Adyar'))
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone     = EXCLUDED.phone;

    ELSIF NEW.role = 'admin' THEN
        INSERT INTO public.admins (user_id, franchise_owner_id, branch_location, full_name, phone, email)
        VALUES (NEW.id, v_franchise_owner_id, v_branch_location, NEW.full_name, COALESCE(NEW.phone, ''), NEW.email)
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone     = EXCLUDED.phone;

    ELSIF NEW.role = 'stylist' THEN
        INSERT INTO public.stylists (user_id, franchise_owner_id, branch_location, full_name, phone, email, gender)
        VALUES (NEW.id, v_franchise_owner_id, v_branch_location, NEW.full_name, COALESCE(NEW.phone, ''), NEW.email, NEW.gender)
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone     = EXCLUDED.phone,
            gender    = EXCLUDED.gender;

    ELSIF NEW.role = 'customer' THEN
        INSERT INTO public.customers (user_id, full_name, phone, email, gender, preferred_branch_location, preferred_salon_id)
        VALUES (NEW.id, NEW.full_name, COALESCE(NEW.phone, ''), NEW.email, NEW.gender, v_branch_location, v_franchise_owner_id)
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone     = EXCLUDED.phone,
            gender    = EXCLUDED.gender;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_user_role_sync
    AFTER INSERT OR UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_role_sync();

-- ============================================
-- AUTO-CREATE CUSTOMER PREFERENCES ON NEW CUSTOMER
-- ============================================

CREATE OR REPLACE FUNCTION public.create_customer_preference_record()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customer_preferences (customer_id)
    VALUES (NEW.id)
    ON CONFLICT (customer_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_create_customer_preferences
    AFTER INSERT ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.create_customer_preference_record();

-- ============================================
-- TWO-WAY HAIRSTYLE SYNC
-- customers.hairstyle_preference <-> customer_preferences.preferred_hairstyle
-- Uses IS DISTINCT FROM to prevent infinite recursion
-- ============================================

CREATE OR REPLACE FUNCTION public.sync_hairstyle_to_preferences()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.customer_preferences
    SET preferred_hairstyle = NEW.hairstyle_preference
    WHERE customer_id = NEW.id
      AND (preferred_hairstyle IS DISTINCT FROM NEW.hairstyle_preference);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_hairstyle_to_customers()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.customers
    SET hairstyle_preference = NEW.preferred_hairstyle
    WHERE id = NEW.customer_id
      AND (hairstyle_preference IS DISTINCT FROM NEW.preferred_hairstyle);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_to_preferences ON public.customers;
CREATE TRIGGER trg_sync_to_preferences
    AFTER UPDATE OF hairstyle_preference ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.sync_hairstyle_to_preferences();

DROP TRIGGER IF EXISTS trg_sync_to_customers ON public.customer_preferences;
CREATE TRIGGER trg_sync_to_customers
    AFTER UPDATE OF preferred_hairstyle ON public.customer_preferences
    FOR EACH ROW EXECUTE FUNCTION public.sync_hairstyle_to_customers();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_owners    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_schedule    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_history    ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

CREATE OR REPLACE FUNCTION is_franchise_owner() RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'franchise_owner');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'franchise_owner'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_stylist() RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'stylist');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- RLS POLICIES
-- ============================================

-- USERS
CREATE POLICY "Franchise owner full access on users"    ON public.users FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins can view all users"               ON public.users FOR SELECT USING (is_admin());
CREATE POLICY "Users can view own profile"              ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"            ON public.users FOR UPDATE USING (auth.uid() = id);

-- FRANCHISE OWNERS
CREATE POLICY "Franchise owner full access on fo"       ON public.franchise_owners FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins can view franchise owners"        ON public.franchise_owners FOR SELECT USING (is_admin());
CREATE POLICY "Public can view franchise info"          ON public.franchise_owners FOR SELECT USING (true);

-- ADMINS
CREATE POLICY "Franchise owner full access on admins"   ON public.admins FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins can view own record"              ON public.admins FOR SELECT USING (user_id = auth.uid());

-- STYLISTS
CREATE POLICY "Franchise owner full access on stylists" ON public.stylists FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage stylists"                  ON public.stylists FOR ALL    USING (is_admin());
CREATE POLICY "Stylists view own record"                ON public.stylists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Public can view stylists"                ON public.stylists FOR SELECT USING (true);

-- CUSTOMERS
CREATE POLICY "Franchise owner full access on customers" ON public.customers FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage customers"                  ON public.customers FOR ALL    USING (is_admin());
CREATE POLICY "Stylists can view customers"              ON public.customers FOR SELECT USING (is_stylist());
CREATE POLICY "Customers can view own profile"           ON public.customers FOR SELECT USING (user_id = auth.uid());

-- CUSTOMER PREFERENCES
CREATE POLICY "Franchise owner access on preferences"   ON public.customer_preferences FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins view preferences"                 ON public.customer_preferences FOR SELECT USING (is_admin());
CREATE POLICY "Stylists view preferences"               ON public.customer_preferences FOR SELECT USING (is_stylist());
CREATE POLICY "Customers manage own preferences"        ON public.customer_preferences FOR ALL
    USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- SERVICES
CREATE POLICY "Franchise owner full access on services" ON public.services FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage services"                  ON public.services FOR ALL    USING (is_admin());
CREATE POLICY "Public can view active services"         ON public.services FOR SELECT USING (is_active = true);

-- OFFERS
CREATE POLICY "Franchise owner full access on offers"   ON public.offers FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage offers"                    ON public.offers FOR ALL    USING (is_admin());
CREATE POLICY "Public can view active offers"           ON public.offers FOR SELECT USING (is_active = true);

-- APPOINTMENTS
CREATE POLICY "Franchise owner full access on appts"    ON public.appointments FOR ALL USING (is_franchise_owner());
CREATE POLICY "Admins manage all appointments"          ON public.appointments FOR ALL USING (is_admin());
CREATE POLICY "Stylists view own appointments"          ON public.appointments FOR SELECT
    USING (stylist_id IN (SELECT id FROM public.stylists WHERE user_id = auth.uid()));
CREATE POLICY "Stylists update own appointment status"  ON public.appointments FOR UPDATE
    USING (stylist_id IN (SELECT id FROM public.stylists WHERE user_id = auth.uid()));
CREATE POLICY "Customers view own appointments"         ON public.appointments FOR SELECT
    USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- STYLIST SCHEDULE
CREATE POLICY "Franchise owner full access on schedule" ON public.stylist_schedule FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage schedules"                 ON public.stylist_schedule FOR ALL    USING (is_admin());
CREATE POLICY "Stylists manage own schedule"            ON public.stylist_schedule FOR ALL
    USING (stylist_id IN (SELECT id FROM public.stylists WHERE user_id = auth.uid()));
CREATE POLICY "Public can view schedules"               ON public.stylist_schedule FOR SELECT USING (true);

-- CUSTOMER HISTORY
CREATE POLICY "Franchise owner full access on history"  ON public.customer_history FOR ALL    USING (is_franchise_owner());
CREATE POLICY "Admins manage history"                   ON public.customer_history FOR ALL    USING (is_admin());
CREATE POLICY "Stylists view customer history"          ON public.customer_history FOR SELECT USING (is_stylist());
CREATE POLICY "Customers view own history"              ON public.customer_history FOR SELECT
    USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));
