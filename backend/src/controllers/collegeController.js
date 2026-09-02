// FILE: backend/src/controllers/collegeController.js
const pool = require('../config/db');

// --- Constants ---
const DEFAULT_WEIGHTS = { rating: 0.25, placement: 0.3, fees: 0.2, rankFit: 0.25 };

// Rank tier definitions: maps student rank ranges to expected college quality
const RANK_TIERS = [
  { maxRank: 1000,  label: 'Top 1000',    expectedRating: 4.7, expectedPlacement: 93 },
  { maxRank: 5000,  label: 'Top 5000',    expectedRating: 4.3, expectedPlacement: 85 },
  { maxRank: 20000, label: 'Top 20000',   expectedRating: 4.0, expectedPlacement: 78 },
  { maxRank: 50000, label: 'Top 50000',   expectedRating: 3.8, expectedPlacement: 72 },
  { maxRank: Infinity, label: 'Open',     expectedRating: 3.5, expectedPlacement: 65 },
];

// Simple in-memory cache for locations (avoids repeated DB calls for static data)
let locationsCache = null;
let locationsCacheTime = 0;
const LOCATIONS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Helpers ---

function getRankTier(rank) {
  return RANK_TIERS.find(tier => rank <= tier.maxRank) || RANK_TIERS[RANK_TIERS.length - 1];
}

/**
 * Calculate how well a college matches the student's rank tier.
 * Returns a value between 0.0 (poor match) and 1.0 (excellent match).
 */
function calculateRankCompatibility(college, rank) {
  const tier = getRankTier(rank);

  // How close is the college to the tier's expected quality?
  const ratingDiff = college.rating - tier.expectedRating;
  const placementDiff = college.placement_percentage - tier.expectedPlacement;

  // We want the fit to be highest (1.0) when the college matches the tier.
  let ratingFit = 1.0;
  if (ratingDiff > 0) {
    // College is better than the student's tier expects -> reach/unlikely.
    // Sharp penalty: if rating is 0.5 higher, fit drops significantly.
    ratingFit = Math.max(0, 1.0 - (ratingDiff * 1.5));
  } else {
    // College is worse -> safe. Gentle penalty so they still show up.
    // If rating is 1.0 lower, fit drops somewhat.
    ratingFit = Math.max(0, 1.0 + (ratingDiff * 0.5));
  }

  let placementFit = 1.0;
  if (placementDiff > 0) {
    // Sharp penalty for overreaching
    placementFit = Math.max(0, 1.0 - (placementDiff / 15));
  } else {
    // Gentle penalty for being safe
    placementFit = Math.max(0, 1.0 + (placementDiff / 40));
  }

  return (ratingFit * 0.5) + (placementFit * 0.5);
}

function normalizeWeights(weights) {
  if (!weights || typeof weights !== 'object') {
    return { ...DEFAULT_WEIGHTS };
  }

  const rating = parseFloat(weights.rating);
  const placement = parseFloat(weights.placement);
  const fees = parseFloat(weights.fees);
  const rankFit = parseFloat(weights.rankFit);

  if (isNaN(rating) || isNaN(placement) || isNaN(fees) || isNaN(rankFit)) {
    console.warn('Invalid weights, using defaults:', weights);
    return { ...DEFAULT_WEIGHTS };
  }

  const sum = rating + placement + fees + rankFit;

  if (sum <= 0 || !isFinite(sum)) {
    return { ...DEFAULT_WEIGHTS };
  }

  return {
    rating: rating / sum,
    placement: placement / sum,
    fees: fees / sum,
    rankFit: rankFit / sum,
  };
}

// --- Controllers ---

async function getColleges(req, res) {
  try {
    const { search, location, maxFees } = req.query;

    let query = 'SELECT * FROM colleges WHERE 1=1';
    const values = [];
    let index = 1;

    if (search) {
      values.push(`%${search}%`);
      query += ` AND LOWER(name) LIKE LOWER($${index++})`;
    }

    if (location) {
      values.push(location);
      query += ` AND LOWER(location) = LOWER($${index++})`;
    }

    if (maxFees && !isNaN(maxFees)) {
      values.push(parseInt(maxFees));
      query += ` AND fees <= $${index++}`;
    }

    query += ' ORDER BY name ASC LIMIT 50';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    console.error('❌ ERROR getColleges:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch colleges. Please try again.', details: err.message
    });
  }
}

// ENRICHED: Returns college + courses, cutoffs, placements, facilities
async function getCollegeById(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    // Parallel fetch all related data
    const [collegeRes, coursesRes, cutoffsRes, placementsRes, facilitiesRes] = await Promise.all([
      pool.query('SELECT * FROM colleges WHERE id = $1', [id]),
      pool.query('SELECT * FROM courses WHERE college_id = $1 ORDER BY branch_name', [id]),
      pool.query('SELECT * FROM cutoffs WHERE college_id = $1 ORDER BY year DESC, branch, exam_type, category', [id]),
      pool.query('SELECT * FROM placements WHERE college_id = $1 ORDER BY branch', [id]),
      pool.query('SELECT * FROM facilities WHERE college_id = $1', [id]),
    ]);

    if (collegeRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'College not found' });
    }

    const college = collegeRes.rows[0];

    res.json({
      success: true,
      data: {
        ...college,
        courses: coursesRes.rows,
        cutoffs: cutoffsRes.rows,
        placements: placementsRes.rows,
        facilities: facilitiesRes.rows[0] || null,
      }
    });

  } catch (err) {
    console.error('❌ ERROR getCollegeById:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch college details.'
    });
  }
}

async function getLocations(req, res) {
  try {
    // Return cached result if still valid
    if (locationsCache && (Date.now() - locationsCacheTime < LOCATIONS_CACHE_TTL)) {
      return res.json({
        success: true,
        count: locationsCache.length,
        data: locationsCache,
      });
    }

    const result = await pool.query(
      'SELECT DISTINCT location FROM colleges ORDER BY location ASC'
    );

    const locations = result.rows.map(row => row.location);

    // Update cache
    locationsCache = locations;
    locationsCacheTime = Date.now();

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });

  } catch (err) {
    console.error('❌ ERROR getLocations:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations.'
    });
  }
}

async function compareColleges(req, res) {
  try {
    let { collegeIds } = req.body;

    if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Provide 2-3 college IDs'
      });
    }

    collegeIds = [...new Set(collegeIds)].map(Number);

    const result = await pool.query(
      'SELECT * FROM colleges WHERE id = ANY($1::int[])',
      [collegeIds]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error('❌ ERROR compare:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to compare colleges.'
    });
  }
}

// UPGRADED: Course-specific predictor with cutoff-based Safe/Moderate/Reach
async function predictColleges(req, res) {
  try {
    const { rank, budget, location, weights, branch, examType, category } = req.body;

    // --- Input validation ---
    if (!rank || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Rank and budget are required'
      });
    }

    if (typeof rank !== 'number' || rank < 1 || rank > 200000) {
      return res.status(400).json({
        success: false,
        error: 'Rank must be between 1 and 200,000'
      });
    }

    if (typeof budget !== 'number' || budget < 0) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be a positive number'
      });
    }

    // --- Normalize weights ---
    const normalizedWeights = normalizeWeights(weights);
    const tier = getRankTier(rank);

    // --- Query colleges within budget ---
    let query = 'SELECT * FROM colleges WHERE fees <= $1';
    const values = [budget];
    let paramIndex = 2;

    if (location) {
      values.push(location);
      query += ` AND LOWER(location) = LOWER($${paramIndex})`;
      paramIndex++;
    }

    if (examType || branch) {
      let subQuery = 'SELECT college_id FROM cutoffs WHERE 1=1';
      
      if (examType) {
        values.push(examType);
        subQuery += ` AND LOWER(exam_type) = LOWER($${paramIndex})`;
        paramIndex++;
      }
      
      if (branch) {
        values.push(branch);
        subQuery += ` AND LOWER(branch) = LOWER($${paramIndex})`;
        paramIndex++;
      }
      
      if (category) {
        values.push(category);
        subQuery += ` AND LOWER(category) = LOWER($${paramIndex})`;
        paramIndex++;
      }
      
      query += ` AND id IN (${subQuery})`;
    }

    query += ' ORDER BY name ASC LIMIT 50';

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        explanations: [],
        weights: normalizedWeights,
        message: 'No colleges match your criteria. Try increasing your budget.'
      });
    }

    // --- If branch/examType/category provided, fetch cutoff data ---
    let cutoffMap = {};
    const useCutoffs = branch && examType && category;

    if (useCutoffs) {
      const collegeIds = rows.map(c => c.id);
      const cutoffQuery = `
        SELECT college_id, branch, exam_type, category, year, closing_rank
        FROM cutoffs
        WHERE college_id = ANY($1::int[])
          AND LOWER(branch) = LOWER($2)
          AND LOWER(exam_type) = LOWER($3)
          AND LOWER(category) = LOWER($4)
        ORDER BY year DESC
      `;
      const cutoffRes = await pool.query(cutoffQuery, [collegeIds, branch, examType, category]);

      // Build map: college_id -> latest closing_rank
      for (const row of cutoffRes.rows) {
        if (!cutoffMap[row.college_id]) {
          cutoffMap[row.college_id] = {
            closingRank: row.closing_rank,
            year: row.year,
            branch: row.branch,
            examType: row.exam_type,
            category: row.category,
          };
        }
      }
    }

    // --- Compute normalized scores ---
    const maxRating = 5.0;
    const maxPlacement = 100;

    // Use budget-relative fee scoring instead of min-max normalization
    // This prevents the cheapest college from always getting a perfect score
    const scored = rows.map(college => {
      // Normalize each factor to 0-1
      const normalizedRating = college.rating / maxRating;
      const normalizedPlacement = college.placement_percentage / maxPlacement;

      // Budget-relative fee score: how much budget headroom you have
      // A college at 50% of budget scores ~0.75, at 100% scores ~0.5, at 10% scores ~0.9
      // This rewards affordability without giving a perfect 1.0 just for being cheapest
      const feeRatio = college.fees / budget;
      const normalizedFees = Math.max(0, 1 - feeRatio);

      // Enhanced rank compatibility that uses cutoff data when available
      let rankCompatibility = calculateRankCompatibility(college, rank);

      // If we have cutoff data, blend actual cutoff fit into rank compatibility
      if (useCutoffs && cutoffMap[college.id]) {
        const closingRank = cutoffMap[college.id].closingRank;
        // How well does the student's rank fit the cutoff? 
        // rank/closingRank < 1 = good fit, > 1 = poor fit
        const cutoffRatio = rank / closingRank;
        let cutoffFit;
        if (cutoffRatio <= 0.5) cutoffFit = 0.95;      // very safe
        else if (cutoffRatio <= 0.7) cutoffFit = 0.85;  // safe
        else if (cutoffRatio <= 1.0) cutoffFit = 0.7;   // moderate
        else if (cutoffRatio <= 1.15) cutoffFit = 0.4;  // reach
        else cutoffFit = 0.15;                           // unlikely
        // Blend: 70% cutoff-based, 30% general compatibility
        rankCompatibility = (cutoffFit * 0.7) + (rankCompatibility * 0.3);
      }

      // Weighted score
      const score =
        (normalizedRating * normalizedWeights.rating) +
        (normalizedPlacement * normalizedWeights.placement) +
        (normalizedFees * normalizedWeights.fees) +
        (rankCompatibility * normalizedWeights.rankFit);

      // --- Cutoff-based confidence label ---
      let confidence = null;
      let cutoffInfo = null;
      let reasoning = '';

      if (useCutoffs && cutoffMap[college.id]) {
        cutoffInfo = cutoffMap[college.id];
        const closingRank = cutoffInfo.closingRank;

        if (rank <= closingRank * 0.7) {
          confidence = 'Safe';
          reasoning = `Your rank ${rank} is well within the ${cutoffInfo.year} closing rank of ${closingRank} for ${cutoffInfo.branch} (${cutoffInfo.category}).`;
        } else if (rank <= closingRank) {
          confidence = 'Moderate';
          reasoning = `Your rank ${rank} is close to the ${cutoffInfo.year} closing rank of ${closingRank} for ${cutoffInfo.branch} (${cutoffInfo.category}) — competitive but possible.`;
        } else if (rank <= closingRank * 1.15) {
          confidence = 'Reach';
          reasoning = `Your rank ${rank} slightly exceeds the ${cutoffInfo.year} closing rank of ${closingRank} for ${cutoffInfo.branch} (${cutoffInfo.category}) — an ambitious pick.`;
        } else {
          confidence = 'Unlikely';
          reasoning = `Your rank ${rank} is above the ${cutoffInfo.year} closing rank of ${closingRank} for ${cutoffInfo.branch} (${cutoffInfo.category}).`;
        }
      } else if (useCutoffs) {
        confidence = 'No Data';
        reasoning = `No cutoff data found for ${branch} via ${examType} (${category}) at this college.`;
      }

      // Determine match level label (general, non-cutoff)
      let matchLevel;
      if (rankCompatibility >= 0.75) matchLevel = 'Excellent Match';
      else if (rankCompatibility >= 0.55) matchLevel = 'Good Match';
      else if (rankCompatibility >= 0.4) matchLevel = 'Moderate Match';
      else matchLevel = 'Reach';

      return {
        ...college,
        predictScore: Math.round(score * 1000) / 10, // score out of 100
        rankCompatibility: Math.round(rankCompatibility * 100) / 100,
        matchLevel,
        confidence,
        cutoffClosingRank: cutoffInfo ? cutoffInfo.closingRank : null,
        cutoffYear: cutoffInfo ? cutoffInfo.year : null,
        reasoning,
      };
    });

    // Sort: if using cutoffs, prioritize Safe > Moderate > Reach > Unlikely, then by score
    if (useCutoffs) {
      const confOrder = { 'Safe': 0, 'Moderate': 1, 'Reach': 2, 'No Data': 3, 'Unlikely': 4 };
      scored.sort((a, b) => {
        const oa = confOrder[a.confidence] ?? 5;
        const ob = confOrder[b.confidence] ?? 5;
        if (oa !== ob) return oa - ob;
        return b.predictScore - a.predictScore;
      });
    } else {
      scored.sort((a, b) => b.predictScore - a.predictScore);
    }

    const top = scored.slice(0, 10);

    // --- Generate explanations ---
    const explanations = top.map((college, idx) => {
      const reasons = [];

      if (college.confidence && college.confidence !== 'No Data') {
        reasons.push(`${college.confidence} choice`);
      }

      // Rank fit
      if (college.rankCompatibility >= 0.75) {
        reasons.push(`excellent match for your rank (${tier.label})`);
      } else if (college.rankCompatibility >= 0.55) {
        reasons.push(`good fit for your rank (${tier.label})`);
      } else if (college.rankCompatibility >= 0.4) {
        reasons.push(`moderate fit for your rank (${tier.label})`);
      } else {
        reasons.push(`ambitious pick for your rank (${tier.label})`);
      }

      // Academic strengths
      if (college.rating >= 4.5) reasons.push('excellent rating');
      else if (college.rating >= 4.0) reasons.push('strong rating');

      if (college.placement_percentage >= 90) reasons.push('top-tier placements');
      else if (college.placement_percentage >= 85) reasons.push('strong placements');

      // Value
      if (college.fees <= budget * 0.6) reasons.push('well under budget');
      else if (college.fees <= budget * 0.8) reasons.push('budget-friendly');

      const reasonText = reasons.join(', ');
      return `#${idx + 1} ${college.name}: ${reasonText} (Score: ${college.predictScore})`;
    });

    res.json({
      success: true,
      count: top.length,
      data: top,
      explanations,
      weights: normalizedWeights,
      rankTier: tier.label,
    });

  } catch (err) {
    console.error('❌ ERROR predictColleges:', err.message);
    res.status(500).json({
      success: false,
      error: 'Prediction failed. Please try again.'
    });
  }
}

// NEW: Get available branches for predictor dropdown
async function getBranches(req, res) {
  try {
    const result = await pool.query('SELECT DISTINCT branch FROM cutoffs ORDER BY branch ASC');
    res.json({ success: true, data: result.rows.map(r => r.branch) });
  } catch (err) {
    console.error('❌ ERROR getBranches:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch branches.' });
  }
}

// NEW: Get available exam types
async function getExamTypes(req, res) {
  try {
    const result = await pool.query('SELECT DISTINCT exam_type FROM cutoffs ORDER BY exam_type ASC');
    res.json({ success: true, data: result.rows.map(r => r.exam_type) });
  } catch (err) {
    console.error('❌ ERROR getExamTypes:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch exam types.' });
  }
}

module.exports = {
  getColleges,
  getCollegeById,
  getLocations,
  compareColleges,
  predictColleges,
  getBranches,
  getExamTypes,
};

