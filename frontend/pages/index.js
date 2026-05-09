// FILE: frontend/pages/index.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import CollegeCard from '../components/CollegeCard';
import CompareBar from '../components/CompareBar';
import { useCompare } from '../context/CompareContext';
import { fetchColleges } from '../lib/api';
import { Loader2, Inbox, ArrowUpDown, TrendingUp, Star, Filter, X, Sparkles, Building2 } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

export default function HomePage() {
  const router = useRouter();
  const { toggleCollege, selectedIds } = useCompare();
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const loadColleges = useCallback(async (searchVal = search, locationVal = location, maxFeesVal = maxFees) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchColleges({
        search: searchVal,
        location: locationVal,
        maxFees: maxFeesVal,
      });
      setColleges(result);
      const uniqueLocations = [...new Set(result.map((c) => c.location))].sort();
      setLocationOptions(uniqueLocations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, location, maxFees]);

  useEffect(() => {
    loadColleges();
  }, []);

  const handleSearch = () => {
    loadColleges();
  };

  const handleReset = async () => {
    setSearch('');
    setLocation('');
    setMaxFees('');
    setSortBy('name');
    try {
      const result = await fetchColleges({});
      setColleges(result);
      const uniqueLocations = [...new Set(result.map((c) => c.location))].sort();
      setLocationOptions(uniqueLocations);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelect = (id) => {
    toggleCollege(id);
  };

  // Sort colleges
  const sortedColleges = [...colleges].sort((a, b) => {
    switch (sortBy) {
      case 'rating-desc':
        return b.rating - a.rating;
      case 'fees-asc':
        return a.fees - b.fees;
      case 'fees-desc':
        return b.fees - a.fees;
      case 'placement-desc':
        return b.placement_percentage - a.placement_percentage;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-[#050816]">
      <Head>
        <title>CollegeFind — Discover Your Perfect College</title>
        <meta name="description" content="Compare top engineering colleges across India. Filter by fees, rating, placement rate, and location. Find your best fit with AI-powered predictions." />
      </Head>
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Explore Section */}
      <main id="explore-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Explore <span className="gradient-text">Colleges</span>
              </h2>
              <p className="text-slate-400 text-sm">Browse, filter, and discover India's top engineering institutes</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center justify-center px-4 bg-slate-800/60 text-slate-400 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all border border-slate-700/50"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Drawer Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsFilterOpen(false)} />
          )}

          {/* Filters Container */}
          <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-[#0a0f1e] p-6 shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:p-0 md:bg-transparent md:w-auto md:max-w-none md:shadow-none md:z-auto ${isFilterOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-4">
              <Filters
                location={location}
                maxFees={maxFees}
                onLocationChange={setLocation}
                onMaxFeesChange={setMaxFees}
                onReset={handleReset}
                locationOptions={locationOptions}
              />

              {/* Sort Dropdown */}
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                  <ArrowUpDown className="w-4 h-4 text-violet-400" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-auto px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition-all"
                >
                  <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
                  <option value="rating-desc" className="bg-slate-900 text-white">⭐ Highest Rating</option>
                  <option value="fees-asc" className="bg-slate-900 text-white">💰 Lowest Fees</option>
                  <option value="fees-desc" className="bg-slate-900 text-white">💰 Highest Fees</option>
                  <option value="placement-desc" className="bg-slate-900 text-white">📈 Best Placement</option>
                </select>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="mt-8 md:hidden">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-400">
              Showing <span className="font-semibold text-white">{sortedColleges.length}</span> colleges
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => loadColleges()}
              className="px-6 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-xl hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedColleges.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No colleges found</p>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium rounded-xl hover:bg-indigo-500/30 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* College Grid */}
        {!loading && !error && sortedColleges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {sortedColleges.map((college, idx) => (
              <div key={college.id} className={`animate-scale-in stagger-${Math.min(idx + 1, 6)}`} style={{ animationFillMode: 'both' }}>
                <CollegeCard
                  college={college}
                  isSelected={selectedIds.includes(college.id)}
                  onSelect={handleSelect}
                  onViewDetails={() => router.push(`/college/${college.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <CompareBar />
    </div>
  );
}
