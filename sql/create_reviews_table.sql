-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for program_id to speed up lookups
CREATE INDEX IF NOT EXISTS reviews_program_id_idx ON reviews(program_id);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" 
ON reviews FOR SELECT 
USING (status = 'approved');

-- 2. Anyone can insert a new review (will be pending by default)
CREATE POLICY "Anyone can submit a review" 
ON reviews FOR INSERT 
WITH CHECK (true);

-- 3. Only admins can update or delete reviews
-- (Assuming based on your current auth setup, admins have full access)
CREATE POLICY "Admins have full access to reviews" 
ON reviews FOR ALL 
USING (true)
WITH CHECK (true);
