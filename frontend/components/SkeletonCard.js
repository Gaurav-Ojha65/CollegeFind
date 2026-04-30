// FILE: frontend/components/SkeletonCard.js
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-lg" />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="h-11 bg-gray-200 rounded-xl" />
    </div>
  );
}
