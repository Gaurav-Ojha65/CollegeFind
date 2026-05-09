// FILE: frontend/components/Filters.js
import { Filter, MapPin, IndianRupee, RotateCcw } from 'lucide-react';

export default function Filters({
  location,
  maxFees,
  onLocationChange,
  onMaxFeesChange,
  onReset,
  locationOptions,
}) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-end w-full">
      <div className="flex-1 w-full md:w-auto md:min-w-[200px]">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          Location
        </label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition-all"
        >
          <option value="" className="bg-slate-900 text-white">All Locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc} className="bg-slate-900 text-white">
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full md:w-auto md:min-w-[200px]">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
          <IndianRupee className="w-4 h-4 text-emerald-400" />
          Max Fees
        </label>
        <input
          type="number"
          placeholder="Max annual fees"
          value={maxFees}
          onChange={(e) => onMaxFeesChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-2.5 bg-slate-800/60 border border-slate-700/50 text-slate-400 font-medium rounded-xl hover:bg-slate-700/50 hover:text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}
