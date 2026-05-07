'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import CollegeCard from '../components/CollegeCard';
import { useCompare } from '../context/CompareContext';
import { predictColleges, fetchLocations, fetchBranches, fetchExamTypes } from '../lib/api';
import {
  Target, IndianRupee, MapPin, Search, Loader2, AlertCircle, Trophy,
  TrendingUp, Star, Sliders, Crosshair, ShieldCheck, ShieldAlert,
  ShieldQuestion, BookOpen, FileText, Users,
} from 'lucide-react';

const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST'];

const CONFIDENCE_STYLES = {
  Safe: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', icon: ShieldCheck, gradient: 'from-emerald-500 to-emerald-600' },
  Moderate: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: ShieldAlert, gradient: 'from-amber-500 to-amber-600' },
  Reach: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: ShieldAlert, gradient: 'from-red-500 to-red-600' },
  Unlikely: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: ShieldQuestion, gradient: 'from-gray-400 to-gray-500' },
  'No Data': { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', icon: ShieldQuestion, gradient: 'from-gray-300 to-gray-400' },
};

export default function PredictorPage() {
  const router = useRouter();
  const { toggleCollege, selectedIds } = useCompare();

  const [formData, setFormData] = useState({ rank: '', budget: '', location: '', branch: '', examType: '', category: 'GEN' });
  const [weights, setWeights] = useState({ rating: 0.25, placement: 0.3, fees: 0.2, rankFit: 0.25 });
  const [showWeights, setShowWeights] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [examTypeOptions, setExamTypeOptions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [rankTier, setRankTier] = useState(null);

  useEffect(() => {
    Promise.all([fetchLocations(), fetchBranches(), fetchExamTypes()])
      .then(([locs, branches, exams]) => {
        setLocationOptions(locs);
        setBranchOptions(branches);
        setExamTypeOptions(exams);
      })
      .catch(err => console.error('Failed to load options:', err));
  }, []);

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
    const { rank, budget, location, branch, examType, category } = formData;

    if (!rank || !budget) { setError('Rank and Budget are required'); return; }
    const rankNum = parseInt(rank);
    const budgetNum = parseInt(budget);
    if (isNaN(rankNum) || rankNum < 1 || rankNum > 200000) { setError('Rank must be between 1 and 200,000. Ranks above 200,000 are not supported.'); return; }
    if (isNaN(budgetNum) || budgetNum < 0) { setError('Budget must be a positive number'); return; }

    setLoading(true); setError(null); setResults(null);
    try {
      const data = await predictColleges({
        rank: rankNum, budget: budgetNum,
        location: location || undefined,
        weights: showWeights ? weights : undefined,
        branch: branch || undefined,
        examType: examType || undefined,
        category: category || undefined,
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
    setFormData({ rank: '', budget: '', location: '', branch: '', examType: '', category: 'GEN' });
    setResults(null); setError(null); setExplanations([]); setRankTier(null);
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handlePredict(); };

  const formatFees = (fees) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fees);

  const currentTierLabel = getRankTierLabel(formData.rank);
  const weightsSum = weights.rating + weights.placement + weights.fees + weights.rankFit;
  const hasCourseFilter = formData.branch && formData.examType && formData.category;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Head>
        <title>College Predictor — CollegeFind</title>
        <meta name="description" content="Get personalized college recommendations based on your rank, budget, branch, and exam type. See Safe, Moderate, and Reach colleges." />
      </Head>
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
              <p className="text-gray-600">Get personalized recommendations with course-level cutoff analysis</p>
            </div>
          </div>
        </div>

        {/* Predictor Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          {/* Row 1: Rank, Budget, Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Trophy className="w-4 h-4" /> Your Rank *</label>
              <input type="number" step="1" placeholder="e.g., 5000" value={formData.rank}
                onChange={e => setFormData({ ...formData, rank: e.target.value })} onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              {currentTierLabel && (
                <p className="mt-1.5 text-xs font-medium text-indigo-600 flex items-center gap-1"><Crosshair className="w-3 h-3" />{currentTierLabel}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><IndianRupee className="w-4 h-4" /> Max Budget *</label>
              <input type="number" step="1000" placeholder="e.g., 200000" value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })} onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4" /> Location</label>
              <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer transition-all">
                <option value="">All Locations</option>
                {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Branch, Exam Type, Category — Course-specific predictor */}
          <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100 p-4 mb-4">
            <p className="text-sm font-semibold text-indigo-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Course-Specific Prediction (Optional — enables Safe/Moderate/Reach labels)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1.5"><BookOpen className="w-3 h-3" /> Branch</label>
                <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Any Branch</option>
                  {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1.5"><FileText className="w-3 h-3" /> Exam Type</label>
                <select value={formData.examType} onChange={e => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Any Exam</option>
                  {examTypeOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1.5"><Users className="w-3 h-3" /> Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Weight Toggles */}
          <div className="mb-4">
            <button onClick={() => setShowWeights(!showWeights)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              <Sliders className="w-4 h-4" /> {showWeights ? 'Hide' : 'Adjust'} recommendation weights
            </button>
            {showWeights && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-3">Adjust how much each factor influences recommendations (auto-normalized)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'rating', label: 'Rating', icon: Star },
                    { key: 'placement', label: 'Placement', icon: TrendingUp },
                    { key: 'fees', label: 'Fees', icon: IndianRupee },
                    { key: 'rankFit', label: 'Rank Fit', icon: Crosshair },
                  ].map(w => (
                    <div key={w.key}>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
                        <w.icon className="w-3 h-3" /> {w.label}
                      </label>
                      <input type="number" step="0.05" min="0" max="1" value={weights[w.key]}
                        onChange={e => setWeights({ ...weights, [w.key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Current sum: {weightsSum.toFixed(2)}
                  {weightsSum.toFixed(1) !== '1.0' && <span className="text-emerald-600 ml-2">✓ Auto-normalized on submit</span>}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handlePredict} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Search className="w-5 h-5" /> Find My Colleges</>}
            </button>
            <button onClick={handleReset} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Reset</button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3"><AlertCircle className="w-5 h-5 text-red-600" /><h3 className="font-semibold text-red-900">Unable to predict</h3></div>
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={handlePredict} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors text-sm">Try Again</button>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="space-y-6">
            {/* Rank Tier Banner */}
            {rankTier && (
              <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <Crosshair className="w-5 h-5 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-800">Your rank tier: <span className="font-bold">{rankTier}</span> — results ranked by compatibility</p>
              </div>
            )}

            {/* Course-specific confidence legend */}
            {hasCourseFilter && (
              <div className="flex flex-wrap gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl">
                <span className="text-sm font-medium text-gray-700 mr-2">Confidence:</span>
                {['Safe', 'Moderate', 'Reach', 'Unlikely'].map(level => {
                  const s = CONFIDENCE_STYLES[level];
                  return (
                    <span key={level} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                      <s.icon className="w-3 h-3" />{level}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Explanations */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5" /> Why These Recommendations</h3>
              <div className="space-y-3">
                {explanations.map((exp, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-emerald-200 text-emerald-700 text-sm font-bold rounded-full flex-shrink-0">{idx + 1}</span>
                    <p className="text-emerald-800 text-sm">{exp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600">Found <span className="font-semibold text-gray-900">{results.length}</span> colleges matching your criteria</p>

            {/* Result Cards with Confidence Labels */}
            <div className="space-y-4">
              {results.map((college) => {
                const conf = college.confidence ? CONFIDENCE_STYLES[college.confidence] : null;
                return (
                  <div key={college.id} className={`bg-white rounded-2xl border-2 transition-all hover:shadow-lg ${
                    conf ? conf.border : 'border-gray-100'
                  }`}>
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Confidence Badge */}
                        {conf && college.confidence !== 'No Data' && (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${conf.bg} ${conf.text} flex-shrink-0`}>
                            <conf.icon className="w-5 h-5" />
                            <div>
                              <p className="font-bold text-sm">{college.confidence}</p>
                              {college.cutoffClosingRank && <p className="text-xs opacity-80">Cutoff: {college.cutoffClosingRank.toLocaleString()}</p>}
                            </div>
                          </div>
                        )}

                        {/* College Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors"
                                onClick={() => router.push(`/college/${college.id}`)}>{college.name}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{college.location}</span>
                                <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{formatFees(college.fees)}</span>
                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{college.rating}</span>
                                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{college.placement_percentage}%</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-bold text-indigo-600">{college.predictScore}</p>
                              <p className="text-xs text-gray-500">Score</p>
                            </div>
                          </div>

                          {/* Reasoning */}
                          {college.reasoning && (
                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{college.reasoning}</p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => router.push(`/college/${college.id}`)}
                              className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">View Details</button>
                            <button onClick={() => toggleCollege(college.id)}
                              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                selectedIds.includes(college.id) ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                              }`}>{selectedIds.includes(college.id) ? '✓ Comparing' : '+ Compare'}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Results */}
        {results && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No colleges match your criteria</p>
            <p className="text-gray-500 mt-1 mb-4">Try increasing your budget, changing location, or selecting a different branch/exam type.</p>
            <button onClick={() => { setFormData(prev => ({ ...prev, budget: String(parseInt(prev.budget || 0) + 100000) })); handlePredict(); }}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm">Increase Budget by ₹1L & Retry</button>
          </div>
        )}
      </main>
    </div>
  );
}
