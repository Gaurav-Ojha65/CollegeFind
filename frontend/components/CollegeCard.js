// FILE: frontend/components/CollegeCard.js
import { MapPin, IndianRupee, Star, TrendingUp, Check, Target, Heart, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useRouter } from 'next/router';

// College type detection & badge config
function getCollegeType(name) {
  const n = name.toLowerCase();
  if (n.includes('indian institute of technology')) return { type: 'IIT', badge: 'badge-iit' };
  if (n.includes('national institute of technology')) return { type: 'NIT', badge: 'badge-nit' };
  if (n.includes('iiit') || n.includes('indian institute of information')) return { type: 'IIIT', badge: 'badge-iiit' };
  if (n.includes('delhi technological') || n.includes('netaji subhas') ||
      n.includes('jadavpur') || n.includes('college of engineering pune') ||
      n.includes('vjti') || n.includes('psg')) return { type: 'GOV', badge: 'badge-nit' };
  return { type: 'PRIVATE', badge: 'badge-private' };
}

// Generate a unique campus image based on college name — deterministic gradient
function getCampusGradient(name, id) {
  const gradients = [
    'from-indigo-900 via-slate-800 to-indigo-950',
    'from-violet-900 via-slate-800 to-purple-950',
    'from-blue-900 via-slate-800 to-cyan-950',
    'from-emerald-900 via-slate-800 to-teal-950',
    'from-amber-900 via-slate-800 to-orange-950',
    'from-rose-900 via-slate-800 to-pink-950',
    'from-sky-900 via-slate-800 to-blue-950',
    'from-fuchsia-900 via-slate-800 to-purple-950',
  ];
  return gradients[id % gradients.length];
}

function getCampusIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('bombay') || n.includes('mumbai')) return '🏛️';
  if (n.includes('delhi')) return '🏫';
  if (n.includes('madras') || n.includes('chennai')) return '🌴';
  if (n.includes('bangalore') || n.includes('bengaluru')) return '🌿';
  if (n.includes('kanpur')) return '🎓';
  if (n.includes('hyderabad')) return '🏰';
  if (n.includes('kolkata')) return '🌉';
  if (n.includes('pune')) return '⛰️';
  if (n.includes('jaipur')) return '🏜️';
  if (n.includes('chandigarh')) return '🌳';
  return '🏛️';
}

export default function CollegeCard({ college, isSelected, onSelect, onViewDetails }) {
  const { user } = useAuth();
  const { toggleSaved, isSaved } = useSaved();
  const router = useRouter();
  const isCollegeSaved = isSaved(college.id);
  const { type: collegeType, badge: badgeClass } = getCollegeType(college.name);
  const gradient = getCampusGradient(college.name, college.id);
  const campusIcon = getCampusIcon(college.name);

  const formatFees = (fees) => {
    if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fees);
  };

  // Match level badge colors (for predictor results)
  const matchColors = {
    'Excellent Match': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Good Match': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Moderate Match': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    'Reach': 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <div
      className={`group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.03] hover:-translate-y-1 ${
        isSelected
          ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20'
          : ''
      }`}
      onClick={onViewDetails}
    >
      {/* Campus Image / Gradient Header */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Large campus emoji icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
          {campusIcon}
        </div>

        {/* Gradient overlay for text readability */}
        <div className="college-img-overlay absolute inset-0" />

        {/* Top row: Type badge + Rating */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`${badgeClass} px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-lg`}>
            {collegeType}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white text-sm font-bold">{college.rating}</span>
          </div>
        </div>

        {/* Action buttons (heart + compare) */}
        <div className="absolute top-3 right-14 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Heart button shows on hover */}
        </div>

        {/* Bottom: College name overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 drop-shadow-lg">
            {college.name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-300 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {college.location}
          </div>
        </div>

        {/* Match Level badge if from predictor */}
        {college.matchLevel && (
          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg ${matchColors[college.matchLevel] || 'bg-gray-500/20 text-gray-400'}`}>
              <Target className="w-3 h-3" />
              {college.matchLevel}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Predict Score (from predictor results) */}
        {college.predictScore !== undefined && (
          <div className="flex items-center justify-between py-2.5 px-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-3">
            <span className="text-sm font-medium text-indigo-400">Match Score</span>
            <span className="text-lg font-extrabold text-indigo-400">{college.predictScore}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="stat-glow bg-slate-800/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <IndianRupee className="w-3 h-3" />
            </div>
            <p className="text-sm font-bold text-white">{formatFees(college.fees)}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-0.5">Annual</p>
          </div>
          <div className="stat-glow bg-slate-800/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <p className="text-sm font-bold text-white">{college.rating}/5</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-0.5">Rating</p>
          </div>
          <div className="stat-glow bg-slate-800/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <TrendingUp className="w-3 h-3" />
            </div>
            <p className="text-sm font-bold text-white">{college.placement_percentage}%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-0.5">Placed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 btn-premium flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                router.push('/login');
                return;
              }
              toggleSaved(college);
            }}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
              isCollegeSaved
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isCollegeSaved ? 'fill-red-400' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(college.id);
            }}
            className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 ${
              isSelected
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30'
            }`}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">+</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
