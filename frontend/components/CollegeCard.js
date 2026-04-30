// FILE: frontend/components/CollegeCard.js
import { MapPin, IndianRupee, Star, TrendingUp, Check, Target } from 'lucide-react';

export default function CollegeCard({ college, isSelected, onSelect, onViewDetails }) {
  const formatFees = (fees) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(fees);
  };

  const isTopRated = college.rating >= 4.5;
  const isBudgetFriendly = college.fees <= 150000;

  // Match level badge colors (for predictor results)
  const matchColors = {
    'Excellent Match': 'bg-emerald-100 text-emerald-800',
    'Good Match': 'bg-blue-100 text-blue-800',
    'Moderate Match': 'bg-amber-100 text-amber-800',
    'Reach': 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
          : 'border-gray-100 hover:border-indigo-300'
      }`}
      onClick={onViewDetails}
    >
      {/* Gradient Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        {college.matchLevel && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${matchColors[college.matchLevel] || 'bg-gray-100 text-gray-800'}`}>
            <Target className="w-3 h-3" />
            {college.matchLevel}
          </span>
        )}
        {!college.matchLevel && isTopRated && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
            <Star className="w-3 h-3" />
            Top Rated
          </span>
        )}
        {!college.matchLevel && isBudgetFriendly && !isTopRated && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            <IndianRupee className="w-3 h-3" />
            Budget Friendly
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {college.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(college.id);
            }}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600 text-white scale-110'
                : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
            }`}
          >
            {isSelected && <Check className="w-4 h-4" />}
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          {college.location}
        </div>

        {/* Predict Score (shown when available from predictor results) */}
        {college.predictScore !== undefined && (
          <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl mb-2">
            <span className="text-sm font-medium text-indigo-700">Match Score</span>
            <span className="text-lg font-bold text-indigo-600">{college.predictScore}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Fees
            </div>
            <span className="font-bold text-gray-900">{formatFees(college.fees)}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Star className="w-4 h-4 text-amber-500" />
              Rating
            </div>
            <span className={`font-bold ${college.rating >= 4.5 ? 'text-amber-600' : 'text-gray-900'}`}>
              {college.rating}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Placement
            </div>
            <span className={`font-bold ${college.placement_percentage >= 90 ? 'text-indigo-600' : 'text-gray-900'}`}>
              {college.placement_percentage}%
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
