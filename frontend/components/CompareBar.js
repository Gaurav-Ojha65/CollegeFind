// FILE: frontend/components/CompareBar.js
'use client';

import { useRouter } from 'next/router';
import { Scale, X, ChevronRight, Sparkles } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useEffect, useState } from 'react';
import { fetchColleges } from '../lib/api';

export default function CompareBar() {
  const router = useRouter();
  const { selectedIds, removeCollege, clearSelected } = useCompare();
  const [isVisible, setIsVisible] = useState(false);
  const [collegeMap, setCollegeMap] = useState({});

  useEffect(() => {
    setIsVisible(selectedIds.length >= 2);
  }, [selectedIds]);

  useEffect(() => {
    fetchColleges()
      .then(data => {
        const map = {};
        data.forEach(c => { map[c.id] = c; });
        setCollegeMap(map);
      })
      .catch(() => setCollegeMap({}));
  }, []);

  if (!isVisible) return null;

  const handleCompare = () => {
    router.push('/compare');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-[#050816] via-[#050816]/95 to-transparent pointer-events-none">
      <div className="max-w-2xl mx-auto">
        <div className="glass border border-indigo-500/20 text-white rounded-2xl shadow-2xl shadow-indigo-500/10 p-4 pointer-events-auto">
          <div className="flex items-center justify-between gap-4">

            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0" role="status" aria-live="polite">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm whitespace-nowrap text-white">
                  {selectedIds.length} college{selectedIds.length > 1 ? 's' : ''} selected
                </p>

                <div className="flex gap-1.5 mt-1 overflow-x-auto scrollbar-hide" aria-label="Selected colleges">
                  {selectedIds.map((id) => {
                    const college = collegeMap[id];
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/20 hover:bg-indigo-500/25 rounded-lg text-xs font-medium transition-colors whitespace-nowrap text-indigo-300"
                      >
                        {college ? college.name : `College #${id}`}
                        <button
                          onClick={() => removeCollege(id)}
                          className="hover:text-red-400 transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
                          aria-label={`Remove college ${id} from comparison`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={clearSelected}
                className="hidden sm:block text-slate-400 hover:text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-lg px-2 py-1"
              >
                Clear all
              </button>

              <button
                onClick={handleCompare}
                className="btn-premium inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Sparkles className="w-4 h-4" />
                Compare Now
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
