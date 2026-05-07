// FILE: backend/src/seed.js
// Run: node src/seed.js
// Seeds courses, cutoffs, placements, facilities for all colleges

require('dotenv').config();
const pool = require('./config/db');

const BRANCHES = ['CSE', 'ECE', 'ME', 'EE'];
const BRANCH_FULL = {
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication Engineering',
  ME: 'Mechanical Engineering',
  EE: 'Electrical Engineering',
};

// College tiers determine cutoff ranges and package data
// Tier 1: IITs, IIIT-H  |  Tier 2: Top NITs, IIIT-D  |  Tier 3: Other NITs, VIT, BITS etc  |  Tier 4: Private
function getCollegeTier(name) {
  const n = name.toLowerCase();
  if (n.includes('indian institute of technology') || n.includes('iiit hyderabad')) return 1;
  if (n.includes('nit trichy') || n.includes('nit warangal') || n.includes('nit surathkal') || n.includes('iiit delhi') || n.includes('delhi technological') || n.includes('netaji subhas') || n.includes('jadavpur')) return 2;
  if (n.includes('national institute of technology') || n.includes('vellore') || n.includes('birla') || n.includes('manipal') || n.includes('thapar') || n.includes('psg') || n.includes('vjti') || n.includes('college of engineering pune') || n.includes('amrita') || n.includes('rv college') || n.includes('sri venkateswara') || n.includes('jaypee')) return 3;
  return 4;
}

function getExamTypes(tier) {
  if (tier <= 2) return ['JEE Advanced', 'JEE Main'];
  return ['JEE Main', 'State CET'];
}

const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST'];
const YEARS = [2023, 2024, 2025];

// Branch difficulty multiplier (CSE hardest = lowest ranks)
const BRANCH_MULT = { CSE: 1.0, ECE: 1.4, EE: 1.7, ME: 1.9 };

function generateCutoffs(collegeId, collegeName) {
  const tier = getCollegeTier(collegeName);
  const exams = getExamTypes(tier);
  const rows = [];

  // Base closing rank for GEN/CSE by tier
  const baseRanks = { 1: 800, 2: 4000, 3: 15000, 4: 40000 };
  const base = baseRanks[tier];

  for (const exam of exams) {
    const examMult = exam === 'JEE Advanced' ? 1.0 : (tier <= 2 ? 2.5 : 1.0);
    for (const branch of BRANCHES) {
      for (const cat of CATEGORIES) {
        const catMult = { GEN: 1.0, OBC: 1.3, SC: 2.0, ST: 2.5 }[cat];
        for (const year of YEARS) {
          const yearJitter = 1 + (Math.random() * 0.15 - 0.075); // ±7.5% year variation
          const closing = Math.round(base * BRANCH_MULT[branch] * catMult * examMult * yearJitter);
          const opening = Math.round(closing * (0.15 + Math.random() * 0.25)); // opening is 15-40% of closing
          rows.push({ college_id: collegeId, branch, exam_type: exam, category: cat, year, opening_rank: Math.max(1, opening), closing_rank: Math.max(opening + 1, closing) });
        }
      }
    }
  }
  return rows;
}

function generateCourses(collegeId, collegeName) {
  const tier = getCollegeTier(collegeName);
  const baseFees = { 1: 250000, 2: 180000, 3: 200000, 4: 160000 };
  return BRANCHES.map(b => ({
    college_id: collegeId,
    branch_name: BRANCH_FULL[b],
    duration: 4,
    total_seats: tier === 1 ? 60 + Math.round(Math.random() * 60) : 80 + Math.round(Math.random() * 100),
    fees_per_year: Math.round((baseFees[tier] + (b === 'CSE' ? 20000 : 0)) * (0.9 + Math.random() * 0.2)),
  }));
}

function generatePlacements(collegeId, collegeName) {
  const tier = getCollegeTier(collegeName);
  const avgPkg = { 1: [18, 28], 2: [10, 16], 3: [6, 12], 4: [4, 7] }[tier];
  const hiPkg = { 1: [50, 120], 2: [25, 55], 3: [15, 35], 4: [10, 20] }[tier];
  const placePct = { 1: [88, 98], 2: [78, 92], 3: [70, 88], 4: [60, 80] }[tier];
  const recruiters = {
    CSE: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Adobe', 'Uber', 'Goldman Sachs', 'Atlassian'],
    ECE: ['Qualcomm', 'Intel', 'Samsung', 'Texas Instruments', 'Broadcom', 'MediaTek', 'NVIDIA'],
    ME: ['Tata Motors', 'L&T', 'Mahindra', 'Bosch', 'Siemens', 'BHEL', 'Maruti Suzuki'],
    EE: ['ABB', 'Schneider Electric', 'Siemens', 'NTPC', 'Power Grid', 'Adani Power', 'Tata Power'],
  };

  return BRANCHES.map(b => {
    const branchMult = { CSE: 1.3, ECE: 1.0, EE: 0.85, ME: 0.8 }[b];
    const avg = +(avgPkg[0] + Math.random() * (avgPkg[1] - avgPkg[0])).toFixed(2) * branchMult;
    const hi = +(hiPkg[0] + Math.random() * (hiPkg[1] - hiPkg[0])).toFixed(2) * (b === 'CSE' ? 1.3 : 1.0);
    const pct = Math.min(100, Math.round(placePct[0] + Math.random() * (placePct[1] - placePct[0]) + (b === 'CSE' ? 5 : 0)));
    const topR = recruiters[b].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 2));
    return {
      college_id: collegeId,
      branch: b,
      avg_package: +avg.toFixed(2),
      highest_package: +hi.toFixed(2),
      placement_pct: pct,
      top_recruiters: topR,
    };
  });
}

function generateFacilities(collegeId, collegeName) {
  const tier = getCollegeTier(collegeName);
  return {
    college_id: collegeId,
    hostel: true,
    hostel_fees: tier === 1 ? 25000 + Math.round(Math.random() * 15000) : 15000 + Math.round(Math.random() * 25000),
    wifi: true,
    labs_count: tier === 1 ? 30 + Math.round(Math.random() * 20) : 10 + Math.round(Math.random() * 20),
    sports: tier <= 2
      ? 'Cricket, Football, Basketball, Badminton, Tennis, Swimming, Athletics, Volleyball'
      : 'Cricket, Football, Basketball, Badminton, Volleyball',
    library: true,
  };
}

async function seed() {
  const client = await pool.connect();
  try {
    // Create tables first
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '..', '..', 'schema_v2.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);
    console.log('✅ Tables created');

    // Clear existing seed data
    await client.query('DELETE FROM cutoffs');
    await client.query('DELETE FROM courses');
    await client.query('DELETE FROM placements');
    await client.query('DELETE FROM facilities');
    console.log('✅ Cleared old data');

    // Get all colleges
    const { rows: colleges } = await client.query('SELECT id, name FROM colleges ORDER BY id');
    console.log(`📚 Seeding data for ${colleges.length} colleges...`);

    let cutoffCount = 0, courseCount = 0, placementCount = 0;

    for (const col of colleges) {
      // COURSES
      const courses = generateCourses(col.id, col.name);
      for (const c of courses) {
        await client.query(
          'INSERT INTO courses (college_id, branch_name, duration, total_seats, fees_per_year) VALUES ($1,$2,$3,$4,$5)',
          [c.college_id, c.branch_name, c.duration, c.total_seats, c.fees_per_year]
        );
        courseCount++;
      }

      // CUTOFFS
      const cutoffs = generateCutoffs(col.id, col.name);
      for (const c of cutoffs) {
        await client.query(
          'INSERT INTO cutoffs (college_id, branch, exam_type, category, year, opening_rank, closing_rank) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [c.college_id, c.branch, c.exam_type, c.category, c.year, c.opening_rank, c.closing_rank]
        );
        cutoffCount++;
      }

      // PLACEMENTS
      const placements = generatePlacements(col.id, col.name);
      for (const p of placements) {
        await client.query(
          'INSERT INTO placements (college_id, branch, avg_package, highest_package, placement_pct, top_recruiters) VALUES ($1,$2,$3,$4,$5,$6)',
          [p.college_id, p.branch, p.avg_package, p.highest_package, p.placement_pct, p.top_recruiters]
        );
        placementCount++;
      }

      // FACILITIES
      const fac = generateFacilities(col.id, col.name);
      await client.query(
        'INSERT INTO facilities (college_id, hostel, hostel_fees, wifi, labs_count, sports, library) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (college_id) DO NOTHING',
        [fac.college_id, fac.hostel, fac.hostel_fees, fac.wifi, fac.labs_count, fac.sports, fac.library]
      );

      console.log(`  ✔ ${col.name}`);
    }

    console.log(`\n🎉 SEED COMPLETE:`);
    console.log(`   Courses:    ${courseCount}`);
    console.log(`   Cutoffs:    ${cutoffCount}`);
    console.log(`   Placements: ${placementCount}`);
    console.log(`   Facilities: ${colleges.length}`);

  } catch (err) {
    console.error('❌ SEED ERROR:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
