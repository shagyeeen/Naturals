-- ============================================
-- NATURALS AI - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'franchise_owner', 'manager', 'stylist', 'customer');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================

CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    customer_code TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE,
    gender gender,
    hairstyle_preference TEXT,
    profile_photo_url TEXT,
    ai_hairstyle_analysis JSONB,
    preferred_salon_id UUID,
    notes TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FRANCHISE OWNERS TABLE
-- ============================================

CREATE TABLE public.franchise_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE,
    franchise_name TEXT,
    franchise_address TEXT,
    branch_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MANAGERS TABLE
-- ============================================

CREATE TABLE public.managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    franchise_owner_id UUID REFERENCES public.franchise_owners(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE,
    branch_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STYLISTS TABLE
-- ============================================

CREATE TABLE public.stylists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    manager_id UUID REFERENCES public.managers(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE,
    gender gender,
    experience_years INTEGER DEFAULT 0,
    specializations TEXT[],
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STYLIST SCHEDULES TABLE
-- ============================================

CREATE TABLE public.stylist_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stylist_id UUID NOT NULL REFERENCES public.stylists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================

CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    stylist_id UUID NOT NULL REFERENCES public.stylists(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'pending',
    notes TEXT,
    total_amount DECIMAL(10, 2),
    payment_status payment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_appointment_time CHECK (end_time > start_time)
);

-- ============================================
-- CUSTOMER HISTORY TABLE
-- ============================================

CREATE TABLE public.customer_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    details JSONB,
    performed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    table_affected TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate customer code
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.customer_code := 'NAT-' || UPPER(SUBSTRING(NEW.full_name FROM 1 FOR 3)) || '-' || 
                        TO_CHAR(NOW(), 'YYYY') || '-' || 
                        LPAD(CAST(COUNT(*) OVER () + 1 AS TEXT), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customer code
CREATE TRIGGER trigger_generate_customer_code
    BEFORE INSERT ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION generate_customer_code();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_customers_timestamp
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_franchise_owners_timestamp
    BEFORE UPDATE ON public.franchise_owners
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_managers_timestamp
    BEFORE UPDATE ON public.managers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stylists_timestamp
    BEFORE UPDATE ON public.stylists
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_appointments_timestamp
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users: Customers can view own profile, admins can view all
CREATE POLICY "Users view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Customers: Can view own, managers+ can view all
CREATE POLICY "Customers view own" ON public.customers
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'franchise_owner'))
    );

CREATE POLICY "Users can insert own customer" ON public.customers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Managers can update customers" ON public.customers
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'franchise_owner'))
    );

-- Stylists: Viewable by staff
CREATE POLICY "Staff can view stylists" ON public.stylists
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'franchise_owner', 'stylist'))
    );

-- Appointments: Customers see own, staff see all
CREATE POLICY "Customers view own appointments" ON public.appointments
    FOR SELECT USING (
        customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'franchise_owner', 'stylist'))
    );

CREATE POLICY "Staff can manage appointments" ON public.appointments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'franchise_owner', 'stylist'))
    );

CREATE POLICY "Customers can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
    );

-- Services: Public read
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Check stylist availability
CREATE OR REPLACE FUNCTION check_stylist_availability(
    p_stylist_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_schedule RECORD;
BEGIN
    -- Check if stylist works on this day
    SELECT * INTO v_schedule
    FROM public.stylist_schedules
    WHERE stylist_id = p_stylist_id 
    AND day_of_week = EXTRACT(DOW FROM p_date)::INTEGER
    AND is_available = TRUE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Check if time is within schedule
    IF p_start_time < v_schedule.start_time OR p_end_time > v_schedule.end_time THEN
        RETURN FALSE;
    END IF;

    -- Check for conflicting appointments
    SELECT COUNT(*) INTO v_count
    FROM public.appointments
    WHERE stylist_id = p_stylist_id
    AND appointment_date = p_date
    AND status != 'cancelled'
    AND id != COALESCE(p_exclude_appointment_id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND (
        (start_time <= p_start_time AND end_time > p_start_time) OR
        (start_time < p_end_time AND end_time >= p_end_time) OR
        (start_time >= p_start_time AND end_time <= p_end_time)
    );

    RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Get available slots for stylist
CREATE OR REPLACE FUNCTION get_available_slots(
    p_stylist_id UUID,
    p_date DATE,
    p_service_duration INTEGER DEFAULT 60
)
RETURNS TABLE(start_time TIME, end_time TIME) AS $$
DECLARE
    v_schedule RECORD;
    v_slot_start TIME;
BEGIN
    -- Get schedule for the day
    SELECT * INTO v_schedule
    FROM public.stylist_schedules
    WHERE stylist_id = p_stylist_id 
    AND day_of_week = EXTRACT(DOW FROM p_date)::INTEGER
    AND is_available = TRUE;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Generate slots
    v_slot_start := v_schedule.start_time;
    WHILE v_slot_start + (p_service_duration || ' minutes')::INTERVAL <= v_schedule.end_time LOOP
        IF check_stylist_availability(p_stylist_id, p_date, v_slot_start, (v_slot_start + (p_service_duration || ' minutes')::INTERVAL)::TIME) THEN
            start_time := v_slot_start;
            end_time := (v_slot_start + (p_service_duration || ' minutes')::INTERVAL)::TIME;
            RETURN NEXT;
        END IF;
        v_slot_start := v_slot_start + INTERVAL '30 minutes';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA - Sample Services
-- ============================================

INSERT INTO public.services (name, description, category, duration_minutes, price) VALUES
('Haircut', 'Standard haircut and styling', 'Basic', 45, 500.00),
('Hair Coloring', 'Full hair coloring service', 'Coloring', 120, 2500.00),
('Hair Treatment', 'Deep conditioning treatment', 'Treatment', 60, 800.00),
('Blow Dry', 'Wash and blow dry styling', 'Basic', 30, 300.00),
('Hair Styling', 'Professional hair styling', 'Styling', 45, 600.00),
('Hair Highlights', 'Partial or full highlights', 'Coloring', 90, 1500.00),
('Keratin Treatment', 'Smoothening and keratin treatment', 'Treatment', 180, 5000.00),
('Hair Extension', 'Professional hair extension', 'Extension', 240, 8000.00);
