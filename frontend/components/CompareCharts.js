'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function CompareCharts({ colleges }) {
  if (!colleges || colleges.length < 2) return null;

  const barData = colleges.map((c, i) => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name,
    'Fees (₹K)': Math.round(c.fees / 1000),
    'Placement %': c.placement_percentage,
    'Rating (×20)': Math.round(c.rating * 20),
  }));

  const radarData = [
    { metric: 'Rating', ...Object.fromEntries(colleges.map((c, i) => [`col${i}`, (c.rating / 5) * 100])) },
    { metric: 'Placement', ...Object.fromEntries(colleges.map((c, i) => [`col${i}`, c.placement_percentage])) },
    { metric: 'Affordability', ...Object.fromEntries(colleges.map((c, i) => [`col${i}`, Math.max(0, 100 - (c.fees / 3000))])) },
  ];

  return (
    <div className="space-y-8">
      {/* Side-by-Side Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Side-by-Side Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
            <Legend />
            <Bar dataKey="Fees (₹K)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Placement %" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Rating (×20)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Performance Radar</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 13, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            {colleges.map((c, i) => (
              <Radar key={c.id} name={c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name}
                dataKey={`col${i}`} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
            ))}
            <Legend />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
