-- Add missing columns to programs table (if they don't exist)
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'transfers',
ADD COLUMN IF NOT EXISTS price_per_person DECIMAL(10, 2) DEFAULT 0;

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  program_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  number_of_persons INTEGER NOT NULL CHECK (number_of_persons > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reservations
CREATE POLICY "Allow authenticated insert on reservations"
ON reservations
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated select on reservations"
ON reservations
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on reservations"
ON reservations
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on reservations"
ON reservations
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_program_id ON reservations(program_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
