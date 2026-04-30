// FILE: frontend/components/CompareBar.js
'use client';

import { useRouter } from 'next/router';
import { Scale, X, ChevronRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useEffect, useState } from 'react';

export default function CompareBar() {
  const router = useRouter();
  const { selectedIds, removeCollege, clearSelected } = useCompare();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedIds.length >= 2);
  }, [selectedIds]);

  if (!isVisible) return null;

  const handleCompare = () => {
    router.push('/compare');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <div className="max-w-2xl mx-auto">
        <div className="bg-indigo-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-4 pointer-events-auto border border-indigo-700/50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0" role="status" aria-live="polite">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/20 rounded-xl">
                <Scale className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm whitespace-nowrap">
                  {selectedIds.length} college{selectedIds.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-1.5 mt-1 overflow-x-auto scrollbar-hide" aria-label="Selected colleges">
                  {selectedIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-700/50 hover:bg-indigo-600/50 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      College #{id}
                      <button
                        onClick={() => removeCollege(id)}
                        className="hover:text-red-300 transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
                        aria-label={`Remove college ${id} from comparison`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={clearSelected}
                className="hidden sm:block text-indigo-300 hover:text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-lg px-2 py-1"
              >
                Clear all
              </button>
              <button
                onClick={handleCompare}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
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
