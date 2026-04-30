-- FILE: schema.sql
-- College Discovery Platform - Database Schema & Seed Data

CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  fees INTEGER NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  placement_percentage INTEGER NOT NULL
);

INSERT INTO colleges (name, location, fees, rating, placement_percentage) VALUES
('Indian Institute of Technology Bombay', 'Mumbai', 250000, 4.9, 95),
('Indian Institute of Technology Delhi', 'Delhi', 245000, 4.9, 96),
('Indian Institute of Technology Madras', 'Chennai', 235000, 4.8, 94),
('Indian Institute of Technology Bangalore', 'Bangalore', 240000, 4.8, 93),
('Indian Institute of Technology Kanpur', 'Kanpur', 230000, 4.7, 92),
('National Institute of Technology Trichy', 'Chennai', 180000, 4.5, 88),
('National Institute of Technology Warangal', 'Hyderabad', 165000, 4.4, 85),
('National Institute of Technology Surathkal', 'Bangalore', 175000, 4.4, 86),
('National Institute of Technology Calicut', 'Kozhikode', 160000, 4.3, 82),
('National Institute of Technology Jaipur', 'Jaipur', 155000, 4.2, 80),
('Vellore Institute of Technology', 'Chennai', 195000, 4.3, 85),
('Birla Institute of Technology Mesra', 'Ranchi', 185000, 4.2, 82),
('Manipal Institute of Technology', 'Bangalore', 210000, 4.1, 80),
('Thapar Institute of Engineering', 'Chandigarh', 225000, 4.2, 83),
('Delhi Technological University', 'Delhi', 190000, 4.3, 87),
('Netaji Subhas University of Technology', 'Delhi', 185000, 4.2, 85),
('Jadavpur University', 'Kolkata', 120000, 4.4, 88),
('College of Engineering Pune', 'Pune', 140000, 4.1, 78),
('VJTI Mumbai', 'Mumbai', 135000, 4.2, 82),
('PSG College of Technology', 'Chennai', 125000, 4.3, 85),
('RV College of Engineering', 'Bangalore', 200000, 4.0, 78),
('BMS College of Engineering', 'Bangalore', 180000, 3.9, 75),
('Sri Venkateswara College of Engineering', 'Chennai', 175000, 4.0, 78),
('Amrita School of Engineering', 'Chennai', 190000, 4.0, 80),
('Kalinga Institute of Industrial Technology', 'Bhubaneswar', 220000, 3.8, 75),
('Lovely Professional University', 'Chandigarh', 165000, 3.7, 70),
('Chitkara University', 'Chandigarh', 155000, 3.8, 72),
('Jaypee Institute of Information Technology', 'Delhi', 210000, 4.0, 80),
('IIIT Hyderabad', 'Hyderabad', 280000, 4.7, 95),
('IIIT Delhi', 'Delhi', 265000, 4.5, 90);
