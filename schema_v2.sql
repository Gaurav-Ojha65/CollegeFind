-- FILE: schema_v2.sql
-- CollegeFind V2 — New tables for courses, cutoffs, placements, facilities

-- ============================================
-- 1. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  branch_name VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 4,
  total_seats INTEGER NOT NULL DEFAULT 60,
  fees_per_year INTEGER NOT NULL
);

-- ============================================
-- 2. CUTOFFS TABLE (the most important table)
-- ============================================
CREATE TABLE IF NOT EXISTS cutoffs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  branch VARCHAR(100) NOT NULL,
  exam_type VARCHAR(50) NOT NULL,
  category VARCHAR(20) NOT NULL DEFAULT 'GEN',
  year INTEGER NOT NULL,
  opening_rank INTEGER NOT NULL,
  closing_rank INTEGER NOT NULL
);

-- ============================================
-- 3. PLACEMENTS TABLE (per-branch)
-- ============================================
CREATE TABLE IF NOT EXISTS placements (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  branch VARCHAR(100) NOT NULL,
  avg_package DECIMAL(5,2) NOT NULL,
  highest_package DECIMAL(6,2) NOT NULL,
  placement_pct INTEGER NOT NULL,
  top_recruiters TEXT[] DEFAULT '{}'
);

-- ============================================
-- 4. FACILITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  hostel BOOLEAN DEFAULT true,
  hostel_fees INTEGER DEFAULT 0,
  wifi BOOLEAN DEFAULT true,
  labs_count INTEGER DEFAULT 10,
  sports VARCHAR(255) DEFAULT 'Cricket, Football, Basketball, Badminton',
  library BOOLEAN DEFAULT true,
  UNIQUE(college_id)
);

-- ============================================
-- 5. INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cutoffs_college_branch ON cutoffs(college_id, branch, exam_type, category);
CREATE INDEX IF NOT EXISTS idx_courses_college ON courses(college_id);
CREATE INDEX IF NOT EXISTS idx_placements_college ON placements(college_id);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating);
CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges(fees);
