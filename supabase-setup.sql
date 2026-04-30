-- ServiceHub Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  duration TEXT,
  icon TEXT,
  rating REAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  total_price REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Service policies
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Providers can insert their own services" ON services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update their own services" ON services FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete their own services" ON services FOR DELETE USING (auth.uid() = provider_id);

-- Booking policies
CREATE POLICY "Customers can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = customer_id);

-- Seed categories
INSERT INTO categories (name, description, icon) VALUES
  ('restaurants', 'Fine dining, casual eats, and catering services', 'fa-utensils'),
  ('houseworkers', 'Cleaning, cooking, and home maintenance', 'fa-home'),
  ('laundry', 'Wash & fold, dry cleaning services', 'fa-soap'),
  ('carwash', 'Interior, exterior, and detailing services', 'fa-car')
ON CONFLICT (name) DO NOTHING;

-- Note: Sample services removed - register as a provider and add services via the dashboard
-- The React app includes fallback sample data for demo purposes