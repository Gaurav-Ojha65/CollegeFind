// FILE: frontend/components/SkeletonCard.js
export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-44 bg-slate-800" />

      <div className="p-4">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/60 rounded-xl p-3">
              <div className="w-4 h-4 bg-slate-700 rounded mx-auto mb-2" />
              <div className="h-4 bg-slate-700 rounded w-12 mx-auto mb-1" />
              <div className="h-2 bg-slate-700/50 rounded w-8 mx-auto" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-11 bg-slate-800 rounded-xl" />
          <div className="w-11 h-11 bg-slate-800 rounded-xl" />
          <div className="w-11 h-11 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
