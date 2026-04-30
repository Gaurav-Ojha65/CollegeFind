// FILE: frontend/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchColleges({ search = '', location = '', maxFees = '' } = {}) {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (maxFees) params.append('maxFees', maxFees);

    const url = `${API_URL}/api/colleges${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return data.data;
  } catch (err) {
    console.error('Error fetching colleges:', err);
    throw err;
  }
}

async function fetchCollege(id) {
  try {
    const response = await fetch(`${API_URL}/api/colleges/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return data.data;
  } catch (err) {
    console.error('Error fetching college:', err);
    throw err;
  }
}

async function compareColleges(collegeIds) {
  try {
    const response = await fetch(`${API_URL}/api/colleges/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeIds }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return data.data;
  } catch (err) {
    console.error('Error comparing colleges:', err);
    throw err;
  }
}

async function predictColleges({ rank, budget, location, weights }) {
  try {
    const response = await fetch(`${API_URL}/api/colleges/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rank, budget, location, weights }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return {
      colleges: data.data,
      explanations: data.explanations || [],
      weights: data.weights,
      rankTier: data.rankTier || null,
    };
  } catch (err) {
    console.error('Error predicting colleges:', err);
    throw err;
  }
}

async function fetchLocations() {
  try {
    const response = await fetch(`${API_URL}/api/colleges/locations`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return data.data;
  } catch (err) {
    console.error('Error fetching locations:', err);
    throw err;
  }
}

module.exports = { fetchColleges, fetchCollege, compareColleges, predictColleges, fetchLocations };
