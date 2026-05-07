// FILE: frontend/pages/index.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import CollegeCard from '../components/CollegeCard';
import CompareBar from '../components/CompareBar';
import { useCompare } from '../context/CompareContext';
import { fetchColleges } from '../lib/api';
import { Loader2, Inbox, ArrowUpDown, TrendingUp, Star, Filter, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Head>
        <title>CollegeFind — Discover Your Perfect College</title>
        <meta name="description" content="Compare top engineering colleges across India. Filter by fees, rating, placement rate, and location. Find your best fit." />
      </Head>
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Your Perfect College
          </h1>
          <p className="text-gray-600 text-lg">
            Compare top engineering, medical, and management institutes across India
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center justify-center px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Drawer Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={() => setIsFilterOpen(false)} />
          )}

          {/* Filters Container (Drawer on Mobile, Row on Desktop) */}
          <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:p-0 md:bg-transparent md:w-auto md:max-w-none md:shadow-none md:z-auto ${isFilterOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
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
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-auto px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer transition-all"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="rating-desc">⭐ Highest Rating</option>
                  <option value="fees-asc">💰 Lowest Fees</option>
                  <option value="fees-desc">💰 Highest Fees</option>
                  <option value="placement-desc">📈 Best Placement</option>
                </select>
              </div>
            </div>
            
            {/* Mobile Apply Button */}
            <div className="mt-8 md:hidden">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{sortedColleges.length}</span> colleges
            </p>
          </div>
        )}

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              onClick={() => loadColleges()}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedColleges.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No colleges found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* College Grid */}
        {!loading && !error && sortedColleges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {sortedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                isSelected={selectedIds.includes(college.id)}
                onSelect={handleSelect}
                onViewDetails={() => router.push(`/college/${college.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <CompareBar />
    </div>
  );
}
