// FILE: frontend/pages/compare.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import CompareTable from '../components/CompareTable';
import CompareCharts from '../components/CompareCharts';
import CompareInsights from '../components/CompareInsights';
import { useCompare } from '../context/CompareContext';
import { compareColleges } from '../lib/api';
import { Loader2, AlertCircle, Trophy, ArrowLeft, RotateCcw } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const { selectedIds, clearSelected } = useCompare();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedIds.length < 2) {
      setError('Please select at least 2 colleges to compare');
      return;
    }

    const loadComparison = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await compareColleges(selectedIds);
        setColleges(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [selectedIds]);

  const handleClearAndGoBack = () => {
    clearSelected();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Head><title>Compare Colleges — CollegeFind</title></Head>
        <Navbar />
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Analyzing colleges...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || colleges.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Unable to compare</h2>
            </div>
            <p className="text-red-700 mb-4">{error || 'Not enough colleges to compare'}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse Colleges
              </Link>
              <button
                onClick={handleClearAndGoBack}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Navbar />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
              <p className="text-gray-600 mt-0.5">
                Smart comparison of {colleges.length} institutions
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse More
            </Link>
            <button
              onClick={handleClearAndGoBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 mb-8" />

        {/* Smart Insights */}
        <CompareInsights colleges={colleges} />

        {/* Section Divider */}
        <div className="h-px bg-gray-200 my-8" />

        {/* Visual Charts */}
        <CompareCharts colleges={colleges} />

        {/* Section Divider */}
        <div className="h-px bg-gray-200 my-8" />

        {/* Comparison Table Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Side-by-Side Comparison</h2>
          <CompareTable colleges={colleges} />
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg flex-shrink-0">
              <Trophy className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-1">Making your decision</h3>
              <p className="text-sm text-indigo-700">
                Consider your priorities: If cost is a concern, look at the Best Value pick. For career outcomes, focus on placement rates. The Overall score balances all factors to help you find the best fit.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
