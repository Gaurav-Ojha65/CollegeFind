// FILE: frontend/pages/college/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { fetchCollege } from '../../lib/api';
import { useCompare } from '../../context/CompareContext';
import {
  MapPin,
  IndianRupee,
  Star,
  TrendingUp,
  ArrowLeft,
  Plus,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function CollegeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addCollege, selectedIds } = useCompare();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadCollege = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCollege(id);
        setCollege(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCollege();
  }, [id]);

  const handleAddToCompare = () => {
    addCollege(college.id);
  };

  const formatFees = (fees) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(fees);
  };

  const getCoursesForCollege = () => {
    const name = college.name.toLowerCase();
    if (name.includes('iit') || name.includes('nit') || name.includes('technology') || name.includes('engineering')) {
      return [
        'B.Tech Computer Science & Engineering',
        'B.Tech Mechanical Engineering',
        'B.Tech Electrical Engineering',
        'B.Tech Civil Engineering',
        'M.Tech Data Science & AI',
        'Master of Business Administration (MBA)',
      ];
    }
    if (name.includes('medical')) {
      return [
        'MBBS (Bachelor of Medicine & Surgery)',
        'MD - General Medicine',
        'MS - General Surgery',
        'BDS (Dental Surgery)',
        'B.Pharm (Pharmacy)',
        'M.Pharm (Pharmacy)',
      ];
    }
    if (name.includes('management') || name.includes('business')) {
      return [
        'MBA (Master of Business Administration)',
        'BBA (Bachelor of Business Administration)',
        'Executive MBA',
        'PGDM - Finance',
        'PGDM - Marketing',
        'PhD in Management',
      ];
    }
    return [
      'B.Tech Computer Science',
      'B.Tech Information Technology',
      'B.Sc Physics',
      'B.Sc Mathematics',
      'MCA (Master of Computer Applications)',
      'MBA',
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Navbar />
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Loading college details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Unable to load college</h2>
            </div>
            <p className="text-red-700 mb-4">{error || 'College not found'}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const courses = getCoursesForCollege();
  const isSelected = selectedIds.includes(college.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{college.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{college.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <IndianRupee className="w-4 h-4" />
              Annual Fees
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatFees(college.fees)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Star className="w-4 h-4" />
              Rating
            </div>
            <p className="text-2xl font-bold text-gray-900">{college.rating}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              Placement
            </div>
            <p className="text-2xl font-bold text-gray-900">{college.placement_percentage}%</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{college.location}</p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courses</h2>
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{course}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCompare}
            disabled={isSelected}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-colors ${
              isSelected
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-5 h-5" />
                Already in Compare
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add to Compare
              </>
            )}
          </button>
          <Link
            href="/compare"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            View Compare
          </Link>
        </div>
      </main>
    </div>
  );
}
