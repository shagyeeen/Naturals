-- ============================================
-- NATURALS AI - SEED DATA
-- Real users + sample data for all tables
-- Last synced: 2026-05-09
-- ============================================

-- ============================================
-- 1. SERVICES
-- ============================================

INSERT INTO public.services (name, category, gender_applicability, duration_minutes, price) VALUES

-- Hair – Women
('Hair Cut (Basic Trim)',        'Hair', 'Women',  30,  500.00),
('Hair Styling',                 'Hair', 'Women',  45, 1000.00),
('Hair Spa (Basic)',             'Hair', 'Women',  60, 1200.00),
('Anti-Dandruff Hair Spa',       'Hair', 'Women',  60, 1500.00),
('Scalp Detox Therapy',          'Hair', 'Women',  45, 1800.00),
('Hair Smoothening',             'Hair', 'Women', 210, 4500.00),
('Hair Straightening',           'Hair', 'Women', 270, 5500.00),
('Keratin Treatment',            'Hair', 'Women', 180, 6000.00),
('Hair Coloring (Global)',       'Hair', 'Women', 120, 3500.00),
('Root Touch-Up',                'Hair', 'Women',  60, 1500.00),
('Hair Botox Treatment',         'Hair', 'Women', 180, 7000.00),
('Hair Extensions Fixing',       'Hair', 'Women', 150, 8000.00),
('Curls / Hair Perming',         'Hair', 'Women', 180, 5000.00),

-- Hair – Men
('Haircut (Basic)',               'Hair', 'Men',  30,  300.00),
('Haircut (Signature)',           'Hair', 'Men',  45,  600.00),
('Hair Styling',                  'Hair', 'Men',  30,  500.00),
('Hair Spa',                      'Hair', 'Men',  60, 1000.00),
('Anti-Dandruff Treatment',       'Hair', 'Men',  45, 1200.00),
('Scalp Detox Therapy',           'Hair', 'Men',  45, 1500.00),
('Keratin Treatment',             'Hair', 'Men', 180, 5500.00),
('Hair Coloring (Global)',        'Hair', 'Men', 120, 3000.00),
('Root Touch-Up',                 'Hair', 'Men',  60, 1200.00),
('Hair Straightening',            'Hair', 'Men', 210, 4500.00),
('Hair Botox Treatment',          'Hair', 'Men', 180, 6000.00),
('Hair Extensions Fixing',        'Hair', 'Men', 150, 7000.00),

-- Face – Both
('Basic Facial',                  'Face', 'Both',  45,  800.00),
('Gold Facial',                   'Face', 'Both',  60, 1500.00),
('Brightening Facial',            'Face', 'Both',  60, 1800.00),
('Anti-Ageing Facial',            'Face', 'Both',  75, 2500.00),
('De-Tan Face Pack',              'Face', 'Both',  30,  600.00),
('Eyebrow Threading',             'Face', 'Both',  15,  100.00),
('Eyebrow Tinting',               'Face', 'Both',  20,  300.00),
('Upper Lip Threading',           'Face', 'Both',  10,   60.00),
('Face Bleach',                   'Face', 'Both',  30,  500.00),
('Microdermabrasion',             'Face', 'Both',  60, 3000.00),
('Face Cleanup',                  'Face', 'Both',  30,  500.00),
('Lip Pigmentation Treatment',    'Face', 'Both',  45, 1200.00),

-- Nail – Both
('Basic Manicure',                        'Nail', 'Both',  30,  400.00),
('Spa Manicure',                          'Nail', 'Both',  45,  700.00),
('Gel Manicure',                          'Nail', 'Both',  45,  900.00),
('French Manicure',                       'Nail', 'Both',  40,  800.00),
('Basic Pedicure',                        'Nail', 'Both',  45,  500.00),
('Spa Pedicure',                          'Nail', 'Both',  60,  900.00),
('Gel Pedicure',                          'Nail', 'Both',  60, 1100.00),
('French Pedicure',                       'Nail', 'Both',  55, 1000.00),
('Nail Art (per hand)',                   'Nail', 'Both',  30,  500.00),
('Nail Extension – Gel (Full Set)',       'Nail', 'Both',  90, 2500.00),
('Nail Extension – Acrylic (Full Set)',   'Nail', 'Both',  90, 2200.00),
('Nail Extension – Powder/Dip (Full Set)','Nail', 'Both',  90, 2800.00),
('Nail Extension Refill',                 'Nail', 'Both',  60, 1200.00),
('Nail Extension Removal',                'Nail', 'Both',  30,  500.00),
('Nail Strengthening Treatment',          'Nail', 'Both',  30,  700.00),
('Cuticle Care & Nail Shaping',           'Nail', 'Both',  20,  300.00);

-- ============================================
-- 2. USERS (with gender & location)
-- ============================================

INSERT INTO public.users (id, email, phone, role, full_name, gender, location) VALUES
-- Franchise Owner
('d44094a6-b735-46cf-b2bf-c0d4c61dafb3', 'shynewebhosters@gmail.com',    '9630852741', 'franchise_owner', 'Anthony Bridgerton',   'male',   'Adyar'),
-- Admin
('7d206759-ca8b-4ec0-b15d-d267a2f84b17', '727824tuit213@skct.edu.in',     '7410852963', 'admin',           'Benedict Bridgerton',  'male',   'Adyar'),
-- Stylists
('0d00b19f-b701-4451-bb1a-207512cd8db0', 'shagindharshanthv@gmail.com',   '9632587410', 'stylist',         'Colin Bridgerton',     'male',   'Adyar'),
('b478eaad-19c2-4813-816c-79d7acfe9ac3', 'sineshana.jayakumar@gmail.com', '8579641302', 'stylist',         'Daphne Bridgerton',    'female', 'Adyar'),
('728807ff-cf8d-481f-8284-045e6fedcaa6', 'tharikasiniselvaraj@gmail.com', '9546713208', 'stylist',         'Eloise Bridgerton',    'female', 'Adyar'),
-- Customers
('07ba6b4e-4ff1-466d-845d-9155fa101522', 'sesha7102006@gmail.com',        '7854219360', 'customer',        'Francesca Bridgerton', 'female', 'Adyar'),
('62ac0c53-f039-4585-a5e3-ee0af1d30fce', 'shagyeeen@gmail.com',           '74109630852','customer',        'Gregory Bridgerton',   'male',   'Adyar');

-- ============================================
-- 3. FRANCHISE OWNERS
-- (auto-created by trigger on user insert above,
--  but seeded here for deterministic IDs)
-- ============================================

INSERT INTO public.franchise_owners (id, user_id, full_name, phone, email, franchise_name, branch_name, branch_address)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'd44094a6-b735-46cf-b2bf-c0d4c61dafb3',
    'Anthony Bridgerton', '9630852741', 'shynewebhosters@gmail.com',
    'Naturals Salon & Spa', 'Adyar', 'Adyar, Chennai, Tamil Nadu'
) ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 4. OFFERS
-- ============================================

INSERT INTO public.offers (id, franchise_owner_id, title, description, promo_code, discount_type, discount_value, min_amount, valid_from, valid_until) VALUES
('f0000000-0000-0000-0000-000000000001',
 'b0000000-0000-0000-0000-000000000001',
 'Welcome Offer', '10% off on your first visit', 'WELCOME10',
 'percentage', 10.00, 500.00, CURRENT_DATE, CURRENT_DATE + 90),

('f0000000-0000-0000-0000-000000000002',
 'b0000000-0000-0000-0000-000000000001',
 'Summer Special', 'Flat ₹500 off on services above ₹2000', 'SUMMER500',
 'flat', 500.00, 2000.00, CURRENT_DATE, CURRENT_DATE + 60);

-- ============================================
-- 5. CUSTOMER DATA BACKFILL
-- Fill date_of_birth, hairstyle_preference, ai_hairstyle_analysis
-- (customers are auto-created by the user insert trigger above)
-- ============================================

UPDATE public.customers
SET
    date_of_birth           = '2006-07-10',
    hairstyle_preference    = 'Layered Cut with Beach Waves',
    ai_hairstyle_analysis   = '{"face_shape": "oval", "suggested_styles": ["Wolf Cut", "Butterfly Cut"], "skin_tone": "fair"}'::jsonb
WHERE email = 'sesha7102006@gmail.com';

UPDATE public.customers
SET
    date_of_birth           = '2008-04-15',
    hairstyle_preference    = 'Modern Taper Fade',
    ai_hairstyle_analysis   = '{"face_shape": "square", "suggested_styles": ["Crew Cut", "Quiff"], "skin_tone": "medium"}'::jsonb
WHERE email = 'shagyeeen@gmail.com';

-- ============================================
-- 6. CUSTOMER PREFERENCES BACKFILL
-- (auto-created by trigger on customer insert,
--  but fill in detailed preference values here)
-- ============================================

UPDATE public.customer_preferences
SET
    hairwash_preference     = 'Before SPA',
    preferred_hairstyle     = 'Layered Cut with Beach Waves',
    water_temperature       = 'Warm',
    scalp_massage_intensity = 'Strong',
    conversation_level      = 'Friendly Chat'
WHERE customer_id = (SELECT id FROM public.customers WHERE email = 'sesha7102006@gmail.com');

UPDATE public.customer_preferences
SET
    hairwash_preference     = 'After SPA',
    preferred_hairstyle     = 'Modern Taper Fade',
    water_temperature       = 'Lukewarm',
    scalp_massage_intensity = 'Medium',
    conversation_level      = 'Quiet Professional'
WHERE customer_id = (SELECT id FROM public.customers WHERE email = 'shagyeeen@gmail.com');

-- ============================================
-- 7. STYLIST SCHEDULE (Mon–Sat, 10am–8pm)
-- day_of_week: 1=Mon ... 6=Sat
-- Runs for all stylists via their user_id lookup
-- ============================================

INSERT INTO public.stylist_schedule (stylist_id, day_of_week, start_time, end_time)
SELECT s.id, d, '10:00:00', '20:00:00'
FROM public.stylists s
CROSS JOIN generate_series(1, 6) d
ON CONFLICT (stylist_id, day_of_week) DO NOTHING;
