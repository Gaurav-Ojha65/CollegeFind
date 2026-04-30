// FILE: frontend/components/CompareTable.js
import { MapPin, IndianRupee, Star, TrendingUp, Check, Award, Wallet, Target } from 'lucide-react';

export default function CompareTable({ colleges }) {
  const formatFees = (fees) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(fees);
  };

  // Find best values for highlighting
  const highestRating = Math.max(...colleges.map((c) => c.rating));
  const lowestFees = Math.min(...colleges.map((c) => c.fees));
  const highestPlacement = Math.max(...colleges.map((c) => c.placement_percentage));

  return (
    <div className="space-y-6">
      {/* College Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => {
          const isTopRated = college.rating === highestRating;
          const isBestValue = college.fees === lowestFees;
          const isTopPlacement = college.placement_percentage === highestPlacement;

          return (
            <div
              key={college.id}
              className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-white font-bold text-lg">{college.name}</h3>
                <div className="flex items-center gap-1 text-indigo-200 text-sm mt-1">
                  <MapPin className="w-3 h-3" />
                  {college.location}
                </div>
              </div>

              {/* Badges */}
              <div className="px-6 py-4 flex flex-wrap gap-2">
                {isTopRated && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
                    <Award className="w-4 h-4" />
                    Top Rated
                  </span>
                )}
                {isBestValue && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                    <Wallet className="w-4 h-4" />
                    Best Value
                  </span>
                )}
                {isTopPlacement && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                    <Target className="w-4 h-4" />
                    Top Placement
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="px-6 pb-6 space-y-3">
                <div className={`flex items-center justify-between py-3 px-4 rounded-xl ${
                  isBestValue ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <IndianRupee className={`w-5 h-5 ${isBestValue ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Fees</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isBestValue ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {formatFees(college.fees)}
                    </span>
                    {isBestValue && (
                      <p className="text-xs text-emerald-600 font-medium">Lowest</p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between py-3 px-4 rounded-xl ${
                  isTopRated ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className={`w-5 h-5 ${isTopRated ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Rating</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isTopRated ? 'text-amber-700' : 'text-gray-900'}`}>
                      {college.rating}
                    </span>
                    {isTopRated && (
                      <p className="text-xs text-amber-600 font-medium">Highest</p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between py-3 px-4 rounded-xl ${
                  isTopPlacement ? 'bg-purple-50 border border-purple-200' : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className={`w-5 h-5 ${isTopPlacement ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">Placement</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isTopPlacement ? 'text-purple-700' : 'text-gray-900'}`}>
                      {college.placement_percentage}%
                    </span>
                    {isTopPlacement && (
                      <p className="text-xs text-purple-600 font-medium">Best</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
