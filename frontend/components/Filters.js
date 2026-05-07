// FILE: frontend/components/Filters.js
import { Filter, MapPin, IndianRupee } from 'lucide-react';

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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer transition-all"
        >
          <option value="">All Locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full md:w-auto md:min-w-[200px]">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <IndianRupee className="w-4 h-4" />
          Max Fees
        </label>
        <input
          type="number"
          placeholder="Max annual fees"
          value={maxFees}
          onChange={(e) => onMaxFeesChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}
