-- =========================================================================
-- DATABASE SEEDER: Travel Programs (Transfers, Excursions, Tour Circuits)
-- =========================================================================

-- 1. Ensure table schema is up-to-date with current application requirements
-- Adding columns that might be missing from initial migrations
ALTER TABLE programs ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS price_per_person numeric;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS duration text;

-- 2. Clear existing programs to avoid duplicates during seeding
TRUNCATE TABLE programs CASCADE;

-- 3. Insert Sample Programs
INSERT INTO programs (id, title, description, category, price_per_person, image, steps, duration)
VALUES 

-- Category: TRANSFERS
(
  'p1', 
  'Airport Transfer Casablanca - Rabat', 
  'Private airport transfer between Casablanca (CMN) and Rabat with door-to-door service and meet & greet.',
  'transfers',
  45.00,
  'https://images.unsplash.com/photo-1540575339264-569259387a45?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Arrival", "description": "Meet representative at the arrival hall"}, {"title": "Transport", "description": "Private car transportation"}, {"title": "Drop-off", "description": "Direct drop-off at your hotel or riad"}]',
  '1h 10m'
),
(
  'p2', 
  'Marrakech City Transfer (Airport)', 
  'Comfortable airport transfer from Marrakech-Menara airport to your riad or hotel in the medina or Gueliz.',
  'transfers',
  35.00,
  'https://images.unsplash.com/photo-1631580133718-62d6652495ea?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Meet & Greet", "description": "Driver waiting with sign at arrivals"}, {"title": "Comfort", "description": "Air-conditioned premium vehicle"}, {"title": "Arrival", "description": "Door-to-door service"}]',
  '45m'
),
(
  'p3', 
  'Fes to Chefchaouen Scenic Transfer', 
  'Travel comfortably from the religious heart of Fes to the blue city of Chefchaouen through the Rif mountains.',
  'transfers',
  85.00,
  'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Departure", "description": "Pick up from your riad in Fes"}, {"title": "Scenic Route", "description": "Stop at panoramic viewpoints in the Rif mountains"}, {"title": "Blue City Arrival", "description": "Drop off at your riad in Chefchaouen"}]',
  '4h 00m'
),

-- Category: EXCURSIONS
(
  'p4', 
  'Ouzoud Waterfalls Day Trip from Marrakech', 
  'Experience the majestic Ouzoud Waterfalls, the highest in North Africa. Explore the cascades and meet local macaques.',
  'excursions',
  60.00,
  'https://images.unsplash.com/photo-1539405353450-4d74a727c95e?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Morning Departure", "description": "Pick up at 8:00 AM from your hotel"}, {"title": "Waterfalls", "description": "Guided walk to the bottom of the falls"}, {"title": "Boat Ride", "description": "Optional traditional boat ride across the lagoon"}, {"title": "Return", "description": "Arrival back in Marrakech around 6:00 PM"}]',
  '10h'
),
(
  'p5', 
  'Ourika Valley & Atlas Mountains Escape', 
  'Perfect getaway from the heat of Marrakech. Discover the lush Ourika valley, traditional Berber markets, and waterfalls.',
  'excursions',
  50.00,
  'https://images.unsplash.com/photo-1489493585363-d69421e0dee3?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Berber Market", "description": "Stop at a traditional Berber village market"}, {"title": "Setti Fatma", "description": "Visit the 7 waterfalls with a local guide"}, {"title": "Tea Ceremony", "description": "Authentic Berber tea experience with a local family"}]',
  '8h'
),
(
  'p6', 
  'Essaouira Mogador Coastal Day Trip', 
  'Explore the charming coastal city of Essaouira. Famous for its medina, fresh seafood, and artistic atmosphere.',
  'excursions',
  70.00,
  'https://images.unsplash.com/photo-1536726650454-e1d522106399?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Departure", "description": "Drive through argan tree forests (watch for climbing goats!)"}, {"title": "Port visit", "description": "See the traditional fishing boats and the Skala"}, {"title": "Medina Walk", "description": "Self-guided or guided exploration of the UNESCO medina"}]',
  '12h'
),

-- Category: TOUR CIRCUITS
(
  'p7', 
  '3-Day Sahara Desert Safari (Merzouga)', 
  'The quintessential Moroccan adventure. Cross the Atlas, visit Ouarzazate, and ride camels into the sunset at dunes.',
  'tour-circuits',
  250.00,
  'https://images.unsplash.com/photo-1509529362331-db6719b6e82a?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Day 1: Atlas & Gorges", "description": "Cross Tizi n Tichka pass to Dades Valley"}, {"title": "Day 2: Into the Desert", "description": "Visit Todra Gorges and camel trek to Sahara luxury camp"}, {"title": "Day 3: Return", "description": "Early sunrise over dunes and long drive back to Marrakech"}]',
  '3 Days'
),
(
  'p8', 
  '7-Day Imperial Cities & Hidden Gems', 
  'Journey through Rabat, Meknes, Fes, and Marrakech. Discover the rich history, architecture, and soul of Morocco.',
  'tour-circuits',
  890.00,
  'https://images.unsplash.com/photo-1577147443647-81867e3a9baf?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Day 1-2: Coastal Cities", "description": "Casablanca Mosque & Rabat Ruins"}, {"title": "Day 3-5: Medieval Fes", "description": "Deep dive into the world largest car-free medina"}, {"title": "Day 6-7: Red City", "description": "Exploration of Marrakech palaces and vibrant souks"}]',
  '7 Days'
),
(
  'p9', 
  '10-Day Northern Morocco Discovery', 
  'Explore the blue alleys of Chefchaouen, the cosmopolitan Tangier, and the cultural powerhouse of Fes.',
  'tour-circuits',
  1290.00,
  'https://images.unsplash.com/photo-1549467610-62c76e22f232?auto=format&fit=crop&q=80&w=1200',
  '[{"title": "Tangier & Coast", "description": "Caves of Hercules and the Mediterranean port"}, {"title": "Blue Pearl", "description": "Full day in Chefchaouen for photography and relaxation"}, {"title": "Historical Core", "description": "In-depth tours of Meknes and Volubilis Roman ruins"}]',
  '10 Days'
);
