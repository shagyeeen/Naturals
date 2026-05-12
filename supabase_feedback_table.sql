-- =====================================================
-- Customer Feedback Table for Sentiment Analysis
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Core rating (1-5 stars)
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Sub-category ratings (1-5 each)
  service_quality SMALLINT CHECK (service_quality >= 1 AND service_quality <= 5),
  stylist_behaviour SMALLINT CHECK (stylist_behaviour >= 1 AND stylist_behaviour <= 5),
  cleanliness SMALLINT CHECK (cleanliness >= 1 AND cleanliness <= 5),
  value_for_money SMALLINT CHECK (value_for_money >= 1 AND value_for_money <= 5),
  
  -- Free text comment
  comment TEXT,
  
  -- Computed sentiment label
  sentiment_label TEXT DEFAULT 'neutral' CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
  
  -- Source of feedback
  source TEXT DEFAULT 'in-app' CHECK (source IN ('in-app', 'google', 'instagram', 'walk-in', 'phone')),
  
  -- Branch location
  branch_location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for faster analytics queries
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON customer_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON customer_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON customer_feedback(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_feedback_branch ON customer_feedback(branch_location);

-- Enable RLS
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all feedback
CREATE POLICY "Allow read access to feedback"
  ON customer_feedback
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert feedback
CREATE POLICY "Allow insert feedback"
  ON customer_feedback
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow service role full access (for admin operations)
CREATE POLICY "Service role full access on feedback"
  ON customer_feedback
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Seed some sample feedback data for demo
-- =====================================================

INSERT INTO customer_feedback (rating, service_quality, stylist_behaviour, cleanliness, value_for_money, comment, sentiment_label, source, branch_location) VALUES
  (5, 5, 5, 5, 4, 'Amazing keratin treatment! Anjali was extremely professional and my hair looks incredible.', 'positive', 'in-app', 'Adyar'),
  (4, 4, 5, 4, 4, 'Great service, loved the ambiance. Slight wait time but worth it.', 'positive', 'google', 'Adyar'),
  (5, 5, 5, 5, 5, 'Best salon experience ever! The glass dermal therapy was transformative.', 'positive', 'instagram', 'Chennai'),
  (3, 3, 4, 3, 2, 'Service was okay but felt overpriced for what I got.', 'neutral', 'in-app', 'RS Puram'),
  (2, 2, 3, 2, 1, 'Not happy with the color outcome. Expected better from the reviews.', 'negative', 'google', 'RS Puram'),
  (5, 5, 5, 5, 5, 'Priya did an exceptional job with my balayage. Perfect highlights!', 'positive', 'in-app', 'Coimbatore'),
  (4, 4, 4, 5, 4, 'Clean salon, friendly staff. Hair botox treatment was excellent.', 'positive', 'in-app', 'Bangalore'),
  (5, 5, 5, 4, 5, 'Wow! The new follicle repair treatment is a game changer.', 'positive', 'instagram', 'Chennai'),
  (4, 5, 4, 4, 3, 'Stylist was great but the products seemed a bit harsh.', 'positive', 'walk-in', 'Adyar'),
  (1, 1, 2, 2, 1, 'Very disappointed. Patch test was skipped and had a mild reaction.', 'negative', 'in-app', 'RS Puram'),
  (5, 5, 5, 5, 5, 'Absolutely love this place! My go-to salon for everything.', 'positive', 'google', 'Chennai'),
  (4, 4, 4, 4, 4, 'Consistent quality every visit. The monsoon hair care was perfect.', 'positive', 'in-app', 'Bangalore'),
  (3, 3, 3, 4, 3, 'Average experience. Nothing special but nothing bad either.', 'neutral', 'walk-in', 'Coimbatore'),
  (5, 4, 5, 5, 4, 'The new dermal therapy is worth every penny. Skin feels amazing!', 'positive', 'instagram', 'Adyar'),
  (4, 4, 5, 4, 4, 'Great consultation before the treatment. Felt very personalized.', 'positive', 'in-app', 'Chennai');
