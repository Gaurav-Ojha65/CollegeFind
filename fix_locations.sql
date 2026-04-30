-- Migration: Fix incorrect college locations
-- Run this on your Supabase database to update existing data

UPDATE colleges SET location = 'Kanpur' WHERE name = 'Indian Institute of Technology Kanpur';
UPDATE colleges SET location = 'Kozhikode' WHERE name = 'National Institute of Technology Calicut';
UPDATE colleges SET location = 'Ranchi' WHERE name = 'Birla Institute of Technology Mesra';
UPDATE colleges SET location = 'Bhubaneswar' WHERE name = 'Kalinga Institute of Industrial Technology';
