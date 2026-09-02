const { newDb } = require('pg-mem');

const COLLEGES_DATA = [
  { name: 'Indian Institute of Technology Bombay', location: 'Mumbai', fees: 195000, rating: 4.9, placement_percentage: 95, website_url: 'https://www.iitb.ac.in' },
  { name: 'Indian Institute of Technology Delhi', location: 'Delhi', fees: 195000, rating: 4.9, placement_percentage: 96, website_url: 'https://home.iitd.ac.in' },
  { name: 'Indian Institute of Technology Madras', location: 'Chennai', fees: 195000, rating: 4.8, placement_percentage: 94, website_url: 'https://www.iitm.ac.in' },
  { name: 'Indian Institute of Technology Bangalore', location: 'Bangalore', fees: 195000, rating: 4.8, placement_percentage: 93, website_url: 'https://iisc.ac.in' },
  { name: 'Indian Institute of Technology Kanpur', location: 'Kanpur', fees: 195000, rating: 4.7, placement_percentage: 92, website_url: 'https://www.iitk.ac.in' },
  { name: 'National Institute of Technology Trichy', location: 'Chennai', fees: 180000, rating: 4.5, placement_percentage: 88, website_url: 'https://www.nitt.edu' },
  { name: 'National Institute of Technology Warangal', location: 'Hyderabad', fees: 165000, rating: 4.4, placement_percentage: 85, website_url: 'https://www.nitw.ac.in' },
  { name: 'National Institute of Technology Surathkal', location: 'Bangalore', fees: 175000, rating: 4.4, placement_percentage: 86, website_url: 'https://www.nitk.ac.in' },
  { name: 'National Institute of Technology Calicut', location: 'Kozhikode', fees: 160000, rating: 4.3, placement_percentage: 82, website_url: 'https://nitc.ac.in' },
  { name: 'National Institute of Technology Jaipur', location: 'Jaipur', fees: 155000, rating: 4.2, placement_percentage: 80, website_url: 'https://mnit.ac.in' },
  { name: 'Vellore Institute of Technology', location: 'Chennai', fees: 195000, rating: 4.3, placement_percentage: 85, website_url: 'https://vit.ac.in' },
  { name: 'Birla Institute of Technology Mesra', location: 'Ranchi', fees: 185000, rating: 4.2, placement_percentage: 82, website_url: 'https://www.bitmesra.ac.in' },
  { name: 'Manipal Institute of Technology', location: 'Bangalore', fees: 210000, rating: 4.1, placement_percentage: 80, website_url: 'https://manipal.edu' },
  { name: 'Thapar Institute of Engineering', location: 'Chandigarh', fees: 225000, rating: 4.2, placement_percentage: 83, website_url: 'https://www.thapar.edu' },
  { name: 'Delhi Technological University', location: 'Delhi', fees: 190000, rating: 4.3, placement_percentage: 87, website_url: 'https://dtu.ac.in' },
  { name: 'Netaji Subhas University of Technology', location: 'Delhi', fees: 185000, rating: 4.2, placement_percentage: 85, website_url: 'http://www.nsut.ac.in' },
  { name: 'Jadavpur University', location: 'Kolkata', fees: 120000, rating: 4.4, placement_percentage: 88, website_url: 'http://www.jaduniv.edu.in' },
  { name: 'College of Engineering Pune', location: 'Pune', fees: 140000, rating: 4.1, placement_percentage: 78, website_url: 'https://www.coep.org.in' },
  { name: 'VJTI Mumbai', location: 'Mumbai', fees: 135000, rating: 4.2, placement_percentage: 82, website_url: 'https://vjti.ac.in' },
  { name: 'PSG College of Technology', location: 'Chennai', fees: 125000, rating: 4.3, placement_percentage: 85, website_url: 'https://www.psgtech.edu' },
  { name: 'RV College of Engineering', location: 'Bangalore', fees: 200000, rating: 4.0, placement_percentage: 78, website_url: 'https://rvce.edu.in' },
  { name: 'BMS College of Engineering', location: 'Bangalore', fees: 180000, rating: 3.9, placement_percentage: 75, website_url: 'https://bmsce.ac.in' },
  { name: 'Sri Venkateswara College of Engineering', location: 'Chennai', fees: 175000, rating: 4.0, placement_percentage: 78, website_url: 'https://www.svce.ac.in' },
  { name: 'Amrita School of Engineering', location: 'Chennai', fees: 190000, rating: 4.0, placement_percentage: 80, website_url: 'https://www.amrita.edu' },
  { name: 'Kalinga Institute of Industrial Technology', location: 'Bhubaneswar', fees: 220000, rating: 3.8, placement_percentage: 75, website_url: 'https://kiit.ac.in' },
  { name: 'Lovely Professional University', location: 'Chandigarh', fees: 165000, rating: 3.7, placement_percentage: 70, website_url: 'https://www.lpu.in' },
  { name: 'Chitkara University', location: 'Chandigarh', fees: 155000, rating: 3.8, placement_percentage: 72, website_url: 'https://www.chitkara.edu.in' },
  { name: 'Jaypee Institute of Information Technology', location: 'Delhi', fees: 210000, rating: 4.0, placement_percentage: 80, website_url: 'https://www.jiit.ac.in' },
  { name: 'IIIT Hyderabad', location: 'Hyderabad', fees: 280000, rating: 4.7, placement_percentage: 95, website_url: 'https://www.iiit.ac.in' },
  { name: 'IIIT Delhi', location: 'Delhi', fees: 265000, rating: 4.5, placement_percentage: 90, website_url: 'https://www.iiitd.ac.in' }
];

const BRANCHES = ['CSE', 'ECE', 'ME', 'EE'];
const BRANCH_FULL = {
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication Engineering',
  ME: 'Mechanical Engineering',
  EE: 'Electrical Engineering',
};

function getCollegeTier(name) {
  const n = name.toLowerCase();
  if (n.includes('indian institute of technology') || n.includes('iiit hyderabad')) return 1;
  if (n.includes('nit trichy') || n.includes('nit warangal') || n.includes('nit surathkal') || n.includes('iiit delhi') || n.includes('delhi technological') || n.includes('netaji subhas') || n.includes('jadavpur')) return 2;
  if (n.includes('national institute of technology') || n.includes('vellore') || n.includes('birla') || n.includes('manipal') || n.includes('thapar') || n.includes('psg') || n.includes('vjti') || n.includes('college of engineering pune') || n.includes('amrita') || n.includes('rv college') || n.includes('sri venkateswara') || n.includes('jaypee')) return 3;
  return 4;
}

function getExamTypes(tier, name) {
  if (name.toLowerCase().includes('jadavpur')) return ['WBJEE', 'JEE Main'];
  if (tier <= 2) return ['JEE Advanced', 'JEE Main'];
  return ['JEE Main', 'State CET'];
}

const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST'];
const YEARS = [2023, 2024, 2025];
const BRANCH_MULT = { CSE: 1.0, ECE: 1.4, EE: 1.7, ME: 1.9 };

function generateCutoffs(collegeId, collegeName) {
  const tier = getCollegeTier(collegeName);
  const exams = getExamTypes(tier, collegeName);
  const rows = [];
  const baseRanks = { 1: 800, 2: 4000, 3: 15000, 4: 40000 };
  const base = baseRanks[tier];

  for (const exam of exams) {
    const examMult = exam === 'JEE Advanced' ? 1.0 : (tier <= 2 ? 2.5 : 1.0);
    for (const branch of BRANCHES) {
      for (const cat of CATEGORIES) {
        const catMult = { GEN: 1.0, OBC: 1.3, SC: 2.0, ST: 2.5 }[cat];
        for (const year of YEARS) {
          const yearJitter = 1 + (Math.random() * 0.15 - 0.075);
          const closing = Math.round(base * BRANCH_MULT[branch] * catMult * examMult * yearJitter);
          const opening = Math.round(closing * (0.15 + Math.random() * 0.25));
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

async function createInMemoryDb() {
  const db = newDb();
  const { Pool } = db.adapters.createPg();
  const rawPool = new Pool();

  await rawPool.query(`
    CREATE TABLE colleges (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      fees INTEGER NOT NULL,
      rating FLOAT NOT NULL,
      placement_percentage INTEGER NOT NULL,
      website_url VARCHAR(255) DEFAULT 'https://example.edu'
    );

    CREATE TABLE courses (
      id SERIAL PRIMARY KEY,
      college_id INTEGER NOT NULL,
      branch_name VARCHAR(100) NOT NULL,
      duration INTEGER NOT NULL DEFAULT 4,
      total_seats INTEGER NOT NULL DEFAULT 60,
      fees_per_year INTEGER NOT NULL
    );

    CREATE TABLE cutoffs (
      id SERIAL PRIMARY KEY,
      college_id INTEGER NOT NULL,
      branch VARCHAR(100) NOT NULL,
      exam_type VARCHAR(50) NOT NULL,
      category VARCHAR(20) NOT NULL DEFAULT 'GEN',
      year INTEGER NOT NULL,
      opening_rank INTEGER NOT NULL,
      closing_rank INTEGER NOT NULL
    );

    CREATE TABLE placements (
      id SERIAL PRIMARY KEY,
      college_id INTEGER NOT NULL,
      branch VARCHAR(100) NOT NULL,
      avg_package FLOAT NOT NULL,
      highest_package FLOAT NOT NULL,
      placement_pct INTEGER NOT NULL,
      top_recruiters TEXT[] DEFAULT '{}'
    );

    CREATE TABLE facilities (
      id SERIAL PRIMARY KEY,
      college_id INTEGER NOT NULL UNIQUE,
      hostel BOOLEAN DEFAULT true,
      hostel_fees INTEGER DEFAULT 0,
      wifi BOOLEAN DEFAULT true,
      labs_count INTEGER DEFAULT 10,
      sports VARCHAR(255) DEFAULT 'Cricket, Football, Basketball, Badminton',
      library BOOLEAN DEFAULT true
    );

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE saved_colleges (
      user_id INTEGER NOT NULL,
      college_id INTEGER NOT NULL,
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, college_id)
    );
  `);

  for (const c of COLLEGES_DATA) {
    const res = await rawPool.query(
      'INSERT INTO colleges (name, location, fees, rating, placement_percentage, website_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [c.name, c.location, c.fees, c.rating, c.placement_percentage, c.website_url]
    );
    const collegeId = res.rows[0].id;

    const courses = generateCourses(collegeId, c.name);
    for (const crs of courses) {
      await rawPool.query(
        'INSERT INTO courses (college_id, branch_name, duration, total_seats, fees_per_year) VALUES ($1,$2,$3,$4,$5)',
        [crs.college_id, crs.branch_name, crs.duration, crs.total_seats, crs.fees_per_year]
      );
    }

    const cutoffs = generateCutoffs(collegeId, c.name);
    for (const cut of cutoffs) {
      await rawPool.query(
        'INSERT INTO cutoffs (college_id, branch, exam_type, category, year, opening_rank, closing_rank) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [cut.college_id, cut.branch, cut.exam_type, cut.category, cut.year, cut.opening_rank, cut.closing_rank]
      );
    }

    const placements = generatePlacements(collegeId, c.name);
    for (const p of placements) {
      await rawPool.query(
        'INSERT INTO placements (college_id, branch, avg_package, highest_package, placement_pct, top_recruiters) VALUES ($1,$2,$3,$4,$5,$6)',
        [p.college_id, p.branch, p.avg_package, p.highest_package, p.placement_pct, p.top_recruiters]
      );
    }

    const fac = generateFacilities(collegeId, c.name);
    await rawPool.query(
      'INSERT INTO facilities (college_id, hostel, hostel_fees, wifi, labs_count, sports, library) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [fac.college_id, fac.hostel, fac.hostel_fees, fac.wifi, fac.labs_count, fac.sports, fac.library]
    );
  }

  // Wrapped query handler that transparently converts pg-specific ANY($x::int[]) syntax to IN (...)
  const wrappedPool = {
    async query(sqlText, values = []) {
      if (typeof sqlText !== 'string') {
        return rawPool.query(sqlText, values);
      }

      let transformedSql = sqlText;
      let transformedValues = values ? [...values] : [];

      // Replace '= ANY($x::int[])' or '= ANY($x)'
      transformedSql = transformedSql.replace(/=\s*ANY\s*\(\s*\$(\d+)(?:::int\[\])?\s*\)/gi, (match, pIndex) => {
        const idx = parseInt(pIndex, 10) - 1;
        const arr = transformedValues[idx];
        if (Array.isArray(arr)) {
          if (arr.length === 0) return 'IN (NULL)';
          return 'IN (' + arr.map(v => (typeof v === 'number' ? v : `'${String(v).replace(/'/g, "''")}'`)).join(', ') + ')';
        }
        return match;
      });

      // Filter out values consumed in IN clauses if necessary
      // If ANY query was like [collegeIds, branch, examType, category],
      // we remove the array parameter from transformedValues and shift remaining $2,$3,$4 down to $1,$2,$3
      if (sqlText.includes('ANY(')) {
        const arrayIndices = [];
        sqlText.replace(/=\s*ANY\s*\(\s*\$(\d+)(?:::int\[\])?\s*\)/gi, (m, pIndex) => {
          arrayIndices.push(parseInt(pIndex, 10));
          return m;
        });

        if (arrayIndices.length > 0) {
          const newVals = [];
          const indexMapping = {};
          let currentNewIdx = 1;
          for (let i = 1; i <= values.length; i++) {
            if (arrayIndices.includes(i)) {
              indexMapping[i] = null;
            } else {
              indexMapping[i] = currentNewIdx++;
              newVals.push(values[i - 1]);
            }
          }
          transformedSql = transformedSql.replace(/\$(\d+)/g, (m, oldIdx) => {
            const num = parseInt(oldIdx, 10);
            return indexMapping[num] ? '$' + indexMapping[num] : m;
          });
          transformedValues = newVals;
        }
      }

      return rawPool.query(transformedSql, transformedValues);
    },
    async end() {
      return rawPool.end();
    }
  };

  return wrappedPool;
}

module.exports = { createInMemoryDb };
