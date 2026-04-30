// FILE: frontend/components/CompareInsights.js
import { Trophy, Wallet, TrendingUp, Star, Award, Lightbulb, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function CompareInsights({ colleges }) {
  if (!colleges || colleges.length < 2) return null;

  // Calculate scores for each college
  const scoredColleges = colleges.map((college) => {
    const maxFees = Math.max(...colleges.map((c) => c.fees));
    const maxRating = 5;
    const maxPlacement = 100;

    const ratingScore = (college.rating / maxRating) * 40;
    const placementScore = (college.placement_percentage / maxPlacement) * 40;
    const feesScore = ((maxFees - college.fees) / maxFees) * 20;

    const overallScore = ratingScore + placementScore + feesScore;

    return {
      ...college,
      overallScore: Math.round(overallScore * 10) / 10,
      ratingScore: Math.round(ratingScore * 10) / 10,
      placementScore: Math.round(placementScore * 10) / 10,
      feesScore: Math.round(feesScore * 10) / 10,
    };
  });

  // Find best in each category
  const bestOverall = [...scoredColleges].sort((a, b) => b.overallScore - a.overallScore)[0];
  const secondBest = [...scoredColleges].sort((a, b) => b.overallScore - a.overallScore)[1];
  const bestValue = [...colleges].sort((a, b) => a.fees - b.fees)[0];
  const bestPlacement = [...colleges].sort((a, b) => b.placement_percentage - a.placement_percentage)[0];
  const bestRated = [...colleges].sort((a, b) => b.rating - a.rating)[0];

  // Calculate confidence level based on score difference
  const scoreDiff = secondBest ? bestOverall.overallScore - secondBest.overallScore : 0;
  const confidenceLevel = scoreDiff >= 1.5 ? 'High' : scoreDiff >= 0.5 ? 'Medium' : 'Low';
  const confidenceColor = confidenceLevel === 'High' ? 'emerald' : confidenceLevel === 'Medium' ? 'amber' : 'gray';

  // Generate dynamic reasoning for best overall
  const generateReasoning = () => {
    const reasons = [];

    if (bestOverall.rating === bestRated?.rating && bestOverall.rating >= 4.5) {
      reasons.push('highest rating');
    }
    if (bestOverall.placement_percentage === bestPlacement.placement_percentage && bestOverall.placement_percentage >= 85) {
      reasons.push('top placements');
    }
    if (bestOverall.fees === bestValue.fees && bestOverall.fees <= 150000) {
      reasons.push('lowest fees');
    }

    // Check for trade-offs
    const tradeOffs = [];
    if (bestOverall.fees > 200000 && bestOverall.fees !== bestValue.fees) {
      tradeOffs.push('higher fees');
    }
    if (bestOverall.placement_percentage < 80) {
      tradeOffs.push('moderate placements');
    }

    let reasoning = '';
    if (reasons.length > 0) {
      reasoning = `${bestOverall.name} stands out with ${reasons.join(', ')}.`;
    } else {
      reasoning = `${bestOverall.name} offers the best overall balance across all factors.`;
    }

    // Add confidence statement
    const confidenceStatement = {
      High: `This recommendation is strong - the score leads by ${scoreDiff.toFixed(1)} points.`,
      Medium: `The choice is competitive - only ${scoreDiff.toFixed(1)} points ahead of second place.`,
      Low: 'Colleges are closely matched - consider your personal priorities.',
    };

    return { reasoning, tradeOffs, confidenceStatement: confidenceStatement[confidenceLevel] };
  };

  const { reasoning, tradeOffs, confidenceStatement } = generateReasoning();

  // Generate trade-off insight for second best
  const generateTradeOff = () => {
    if (!secondBest) return null;

    const comparisons = [];

    if (secondBest.fees < bestOverall.fees) {
      const savings = Math.round((bestOverall.fees - secondBest.fees) / 1000);
      comparisons.push(`₹${savings}K cheaper annually`);
    }
    if (secondBest.placement_percentage > bestOverall.placement_percentage) {
      const diff = secondBest.placement_percentage - bestOverall.placement_percentage;
      comparisons.push(`${diff}% better placement rate`);
    }
    if (secondBest.rating > bestOverall.rating) {
      comparisons.push(`higher rating (${secondBest.rating} vs ${bestOverall.rating})`);
    }

    if (comparisons.length === 0) return null;

    return {
      college: secondBest,
      text: `${secondBest.name} offers ${comparisons.join(', ')}, but scores lower overall.`,
    };
  };

  const tradeOff = generateTradeOff();

  const colorClasses = {
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'text-amber-900',
      badge: 'bg-amber-500',
      progress: 'bg-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: 'text-emerald-900',
      badge: 'bg-emerald-500',
      progress: 'bg-emerald-500',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'text-purple-900',
      badge: 'bg-purple-500',
      progress: 'bg-purple-500',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      title: 'text-indigo-900',
      badge: 'bg-indigo-500',
      progress: 'bg-indigo-500',
    },
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Main Insight Card - Editor's Choice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-100 rounded-xl flex-shrink-0">
            <Trophy className="w-7 h-7 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-amber-900">Editor's Choice</h3>
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                TOP PICK
              </span>
              <span className={`px-3 py-1 bg-${confidenceColor}-100 text-${confidenceColor}-800 text-xs font-semibold rounded-full`}>
                {confidenceLevel} Confidence
              </span>
            </div>
            <p className="text-amber-900 font-semibold text-lg mb-2">
              {bestOverall.name}
            </p>
            <p className="text-amber-700 mb-3">
              {reasoning}
            </p>

            {/* Stats with Progress Bars */}
            <div className="space-y-3 mb-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <Star className="w-4 h-4" />
                    Rating
                  </span>
                  <span className="font-semibold text-amber-900">{bestOverall.rating}/5.0</span>
                </div>
                <div className="h-2.5 bg-amber-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(bestOverall.rating / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <TrendingUp className="w-4 h-4" />
                    Placement
                  </span>
                  <span className="font-semibold text-amber-900">{bestOverall.placement_percentage}%</span>
                </div>
                <div className="h-2.5 bg-amber-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${bestOverall.placement_percentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <Wallet className="w-4 h-4" />
                    Fees (lower is better)
                  </span>
                  <span className="font-semibold text-amber-900">₹{(bestOverall.fees / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-2.5 bg-amber-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${((Math.max(...colleges.map(c => c.fees)) - bestOverall.fees) / Math.max(...colleges.map(c => c.fees))) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Confidence Statement */}
            <div className="flex items-start gap-2 p-3 bg-amber-100/50 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">{confidenceStatement}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-4xl font-bold text-amber-600">{bestOverall.overallScore}</div>
            <div className="text-sm text-amber-700 font-medium">Overall Score</div>
            <div className="mt-2 h-20 w-3 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="w-full bg-amber-500 rounded-full"
                style={{ height: `${bestOverall.overallScore * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trade-off Insight */}
      {tradeOff && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Alternative Consideration</h4>
              <p className="text-sm text-blue-700">{tradeOff.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestValue && bestValue.fees < 200000 && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="emerald-100 p-2.5 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Best Value</h4>
                <p className="text-sm text-emerald-700">{bestValue.name}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Annual Fees</span>
                <span className="font-semibold text-emerald-900">₹{(bestValue.fees / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rating</span>
                <span className="font-semibold text-emerald-900">{bestValue.rating}</span>
              </div>
              <div className="h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(bestValue.fees / 250000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-emerald-700 mt-2">
                Most affordable option with solid academics
              </p>
            </div>
          </div>
        )}

        {bestPlacement && bestPlacement.placement_percentage >= 85 && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="purple-100 p-2.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-purple-900">Best Placement</h4>
                <p className="text-sm text-purple-700">{bestPlacement.name}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Placement Rate</span>
                <span className="font-semibold text-purple-900">{bestPlacement.placement_percentage}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rating</span>
                <span className="font-semibold text-purple-900">{bestPlacement.rating}</span>
              </div>
              <div className="h-2 bg-purple-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${bestPlacement.placement_percentage}%` }}
                />
              </div>
              <p className="text-xs text-purple-700 mt-2">
                Highest placement success rate
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Score Breakdown with Progress Bars */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
        </div>
        <div className="space-y-4">
          {scoredColleges.map((college, index) => (
            <div key={college.id} className={`p-4 rounded-xl ${index === 0 ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{college.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {college.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {college.placement_percentage}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> ₹{(college.fees / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <div className={`text-2xl font-bold ${index === 0 ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {college.overallScore}
                  </div>
                </div>
              </div>

              {/* Component Scores */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">{college.ratingScore}/40</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(college.ratingScore / 40) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Placement</span>
                    <span className="font-medium text-gray-900">{college.placementScore}/40</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(college.placementScore / 40) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium text-gray-900">{college.feesScore}/20</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(college.feesScore / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Scoring:</span> 40% rating + 40% placement + 20% fees (lower = better).
            Total score out of 100, displayed as /10.
          </p>
        </div>
      </div>
    </div>
  );
}
