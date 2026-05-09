// FILE: frontend/components/SearchBar.js
import { Search, X, Sparkles } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search colleges by name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-10 py-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        className="btn-premium flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
      >
        <Sparkles className="w-4 h-4" />
        Search
      </button>
    </div>
  );
}
