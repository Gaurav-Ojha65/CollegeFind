'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import CollegeCard from '../components/CollegeCard';
import { useCompare } from '../context/CompareContext';
import { predictColleges, fetchLocations } from '../lib/api';
import {
  Target,
  IndianRupee,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  Trophy,
  TrendingUp,
  Star,
  Sliders,
  Crosshair,
} from 'lucide-react';

export default function PredictorPage() {
  const router = useRouter();
  const { toggleCollege, selectedIds } = useCompare();

  const [formData, setFormData] = useState({
    rank: '',
    budget: '',
    location: '',
  });

  const [weights, setWeights] = useState({
    rating: 0.25,
    placement: 0.3,
    fees: 0.2,
    rankFit: 0.25,
  });

  const [showWeights, setShowWeights] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [rankTier, setRankTier] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await fetchLocations();
        setLocationOptions(locations);
      } catch (err) {
        console.error('Failed to load locations:', err);
      }
    };
    loadLocations();
  }, []);

  // Compute rank tier label locally for instant feedback
  const getRankTierLabel = (rank) => {
    const r = parseInt(rank);
    if (isNaN(r) || r < 1) return null;
    if (r <= 1000) return 'Top 1000 — Tier 1 (Premium Institutes)';
    if (r <= 5000) return 'Top 5000 — Tier 2 (Elite Institutes)';
    if (r <= 20000) return 'Top 20000 — Tier 3 (Strong Institutes)';
    if (r <= 50000) return 'Top 50000 — Tier 4 (Good Institutes)';
    return 'Open Category — Tier 5 (All Institutes)';
  };

  const handlePredict = async () => {
    const { rank, budget, location } = formData;

    if (!rank || !budget) {
      setError('Rank and Budget are required');
      return;
    }

    const rankNum = parseInt(rank);
    const budgetNum = parseInt(budget);

    if (isNaN(rankNum) || rankNum < 1 || rankNum > 100000) {
      setError('Rank must be between 1 and 100000');
      return;
    }

    if (isNaN(budgetNum) || budgetNum < 0) {
      setError('Budget must be a positive number');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await predictColleges({
        rank: rankNum,
        budget: budgetNum,
        location: location || undefined,
        weights: showWeights ? weights : undefined,
      });

      setResults(data.colleges);
      setExplanations(data.explanations || []);
      setRankTier(data.rankTier || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ rank: '', budget: '', location: '' });
    setResults(null);
    setError(null);
    setExplanations([]);
    setRankTier(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePredict();
    }
  };

  const formatFees = (fees) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(fees);
  };

  const currentTierLabel = getRankTierLabel(formData.rank);
  const weightsSum = weights.rating + weights.placement + weights.fees + weights.rankFit;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Navbar />

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">College Predictor</h1>
              <p className="text-gray-600">Get personalized recommendations based on your rank and budget</p>
            </div>
          </div>
        </div>

        {/* Predictor Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Rank Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Trophy className="w-4 h-4" />
                Your Rank *
              </label>
              <input
                type="number"
                step="1"
                placeholder="e.g., 5000"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {/* Rank tier indicator */}
              {currentTierLabel && (
                <p className="mt-1.5 text-xs font-medium text-indigo-600 flex items-center gap-1">
                  <Crosshair className="w-3 h-3" />
                  {currentTierLabel}
                </p>
              )}
            </div>

            {/* Budget Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="w-4 h-4" />
                Max Budget *
              </label>
              <input
                type="number"
                step="1000"
                placeholder="e.g., 200000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Preferred Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer transition-all"
              >
                <option value="">All Locations</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight Toggles */}
          <div className="mb-4">
            <button
              onClick={() => setShowWeights(!showWeights)}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              {showWeights ? 'Hide' : 'Adjust'} recommendation weights
            </button>

            {showWeights && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-3">
                  Adjust how much each factor influences recommendations (will be auto-normalized to sum to 1.0)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
                      <Star className="w-3 h-3" /> Rating
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.rating}
                      onChange={(e) => setWeights({ ...weights, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
                      <TrendingUp className="w-3 h-3" /> Placement
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.placement}
                      onChange={(e) => setWeights({ ...weights, placement: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
                      <IndianRupee className="w-3 h-3" /> Fees
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.fees}
                      onChange={(e) => setWeights({ ...weights, fees: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
                      <Crosshair className="w-3 h-3" /> Rank Fit
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={weights.rankFit}
                      onChange={(e) => setWeights({ ...weights, rankFit: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Current sum: {weightsSum.toFixed(2)}
                  {weightsSum.toFixed(1) !== '1.0' && (
                    <span className="text-emerald-600 ml-2">✓ Auto-normalized on submit</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find My Colleges
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Unable to predict</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="space-y-6">
            {/* Rank Tier Banner */}
            {rankTier && (
              <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <Crosshair className="w-5 h-5 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-800">
                  Your rank tier: <span className="font-bold">{rankTier}</span> — results are ranked by compatibility with your profile
                </p>
              </div>
            )}

            {/* Explanations */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Why These Recommendations
              </h3>
              <div className="space-y-3">
                {explanations.map((exp, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-emerald-200 text-emerald-700 text-sm font-bold rounded-full flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-emerald-800 text-sm">{exp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{results.length}</span> colleges matching your criteria
              </p>
            </div>

            {/* College Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isSelected={selectedIds.includes(college.id)}
                  onSelect={toggleCollege}
                  onViewDetails={() => router.push(`/college/${college.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty Results */}
        {results && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No colleges found</p>
            <p className="text-gray-500 mt-1">Try increasing your budget or adjusting location filter</p>
          </div>
        )}
      </main>
    </div>
  );
}
