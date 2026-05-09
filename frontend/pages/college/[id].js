import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { fetchCollege } from '../../lib/api';
import { useCompare } from '../../context/CompareContext';
import {
  MapPin, IndianRupee, Star, TrendingUp, ArrowLeft, Plus, Check, Loader2,
  AlertCircle, BookOpen, GraduationCap, Building2, Wifi, Dumbbell,
  Library, Home, Users, Award, LayoutDashboard, Sparkles, Calculator, ExternalLink
} from 'lucide-react';
import CompareBar from '../../components/CompareBar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'Courses & Cutoffs', icon: BookOpen },
  { key: 'placements', label: 'Placements', icon: TrendingUp },
  { key: 'admission', label: 'Admission Criteria', icon: GraduationCap },
  { key: 'roi', label: 'ROI Calculator', icon: Calculator },
  { key: 'facilities', label: 'Facilities', icon: Building2 },
];

const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST'];

export default function CollegeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addCollege, selectedIds } = useCompare();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // ROI Calculator State
  const [roiBranch, setRoiBranch] = useState('');
  const [loanInterest, setLoanInterest] = useState(8.5);
  const [loanYears, setLoanYears] = useState(5);

  useEffect(() => {
    if (!id) return;
    const loadCollege = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCollege(id);
        setCollege(result);
        if (result.cutoffs?.length > 0) {
          const branches = [...new Set(result.cutoffs.map(c => c.branch))];
          setSelectedBranch(branches[0] || '');
          const years = [...new Set(result.cutoffs.map(c => c.year))].sort((a, b) => b - a);
          setSelectedYear(years[0]?.toString() || '');
        }
        if (result.placements?.length > 0) {
          setRoiBranch(result.placements[0]?.branch || '');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCollege();
  }, [id]);

  const formatFees = (fees) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fees);

  const formatPackage = (lpa) => `₹${lpa} LPA`;

  const isSelected = college ? selectedIds.includes(college.id) : false;

  // Derived data
  const branches = college?.cutoffs ? [...new Set(college.cutoffs.map(c => c.branch))].sort() : [];
  const years = college?.cutoffs ? [...new Set(college.cutoffs.map(c => c.year))].sort((a, b) => b - a) : [];
  const examTypes = college?.cutoffs ? [...new Set(college.cutoffs.map(c => c.exam_type))].sort() : [];

  const filteredCutoffs = college?.cutoffs?.filter(c =>
    (!selectedBranch || c.branch === selectedBranch) &&
    (!selectedYear || c.year === parseInt(selectedYear))
  ) || [];

  const cutoffsByExam = {};
  filteredCutoffs.forEach(c => {
    if (!cutoffsByExam[c.exam_type]) cutoffsByExam[c.exam_type] = [];
    cutoffsByExam[c.exam_type].push(c);
  });

  // Trend Data for LineChart
  const trendData = useMemo(() => {
    if (!college?.cutoffs || !selectedBranch) return [];
    
    // Get GEN cutoffs for the selected branch across all years
    const branchCutoffs = college.cutoffs.filter(c => c.branch === selectedBranch && c.category === 'GEN');
    
    // Group by year
    const yearlyData = {};
    branchCutoffs.forEach(c => {
      if (!yearlyData[c.year]) yearlyData[c.year] = { year: c.year };
      yearlyData[c.year][c.exam_type] = c.closing_rank;
    });
    
    return Object.values(yearlyData).sort((a, b) => a.year - b.year);
  }, [college, selectedBranch]);

  // ROI Calculations
  const roiCalculations = useMemo(() => {
    if (!college || !roiBranch) return null;
    
    const placementData = college.placements?.find(p => p.branch === roiBranch);
    const courseData = college.courses?.find(c => c.branch_name === roiBranch);
    
    const annualFee = courseData ? courseData.fees_per_year : college.fees;
    const duration = courseData ? courseData.duration : 4;
    const totalFees = annualFee * duration;
    const avgPackageLPA = placementData ? placementData.avg_package : (college.placements?.[0]?.avg_package || 5);
    const avgPackageValue = avgPackageLPA * 100000;
    
    // Simple loan amortization
    const principal = totalFees;
    const ratePerMonth = (loanInterest / 100) / 12;
    const numberOfPayments = loanYears * 12;
    
    let emi = 0;
    if (ratePerMonth > 0) {
      emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfPayments)) / (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);
    } else {
      emi = principal / numberOfPayments;
    }
    
    const totalRepayment = emi * numberOfPayments;
    const totalInterest = totalRepayment - principal;
    const monthlySalary = avgPackageValue / 12;
    const takeHomePercent = 0.8; // Rough estimate of after-tax take home
    const monthlyTakeHome = monthlySalary * takeHomePercent;
    
    // Months to recover total investment (without interest vs with interest)
    const paybackMonthsBase = totalFees / monthlyTakeHome;
    const paybackMonthsLoan = totalRepayment / monthlyTakeHome;

    return {
      totalFees, duration, avgPackageValue, avgPackageLPA,
      emi, totalRepayment, totalInterest, monthlySalary, monthlyTakeHome,
      paybackMonthsBase, paybackMonthsLoan
    };
  }, [college, roiBranch, loanInterest, loanYears]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816]">
        <Navbar />
        <div className="flex justify-center items-center py-16 pt-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-slate-400">Loading college details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-[#050816]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-32">
          <div className="glass-card border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-lg font-semibold text-red-400">Unable to load college</h2>
            </div>
            <p className="text-slate-400 mb-4">{error || 'College not found'}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden pb-20">
      <Head>
        <title>{college.name} — CollegeFind</title>
      </Head>

      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        {/* Hero Header */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{college.name}</h1>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <span className="text-lg">{college.location}</span>
                </div>
                {(college.website_url || true) && (
                  <a 
                    href={(!college.website_url || college.website_url === 'https://example.edu') 
                      ? `https://www.google.com/search?q=${encodeURIComponent(college.name + ' official website')}`
                      : college.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium">Official Website</span>
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => addCollege(college.id)}
              disabled={isSelected}
              className={`flex items-center gap-2 px-5 py-3 font-bold rounded-xl transition-all duration-300 flex-shrink-0 ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'btn-premium bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105'
              }`}
            >
              {isSelected ? <><Check className="w-5 h-5" /> In Compare</> : <><Plus className="w-5 h-5" /> Compare</>}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1"><IndianRupee className="w-4 h-4" /> Annual Fees</div>
              <p className="text-xl font-bold text-white">{formatFees(college.fees)}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1"><Star className="w-4 h-4" /> Rating</div>
              <p className="text-xl font-bold text-white">{college.rating} / 5.0</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1"><TrendingUp className="w-4 h-4" /> Placement</div>
              <p className="text-xl font-bold text-white">{college.placement_percentage}%</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-violet-500/30 transition-colors">
              <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold mb-1"><Users className="w-4 h-4" /> Courses</div>
              <p className="text-xl font-bold text-white">{college.courses?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 glass rounded-xl p-1.5 mb-6 overflow-x-auto shadow-sm animate-slide-up-delayed">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-2xl animate-slide-up-delayed-2">

          {/* ========== TAB: OVERVIEW ========== */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-indigo-400" /> College Overview
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                {college.name} is located in {college.location} with an overall rating of <strong className="text-white">{college.rating}/5.0</strong>.
                The institution offers <strong className="text-white">{college.courses?.length || 0} engineering branches</strong> with
                a placement rate of <strong className="text-white">{college.placement_percentage}%</strong> and annual fees starting at <strong className="text-white">{formatFees(college.fees)}</strong>.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-3xl font-bold text-emerald-400">{college.courses?.length || 0}</p>
                  <p className="text-xs font-semibold text-emerald-500 mt-1 uppercase tracking-wider">Branches</p>
                </div>
                <div className="text-center p-5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <p className="text-3xl font-bold text-amber-400">{years.length * 12 || '—'}</p>
                  <p className="text-xs font-semibold text-amber-500 mt-1 uppercase tracking-wider">Cutoff Records</p>
                </div>
                <div className="text-center p-5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <p className="text-3xl font-bold text-indigo-400">{examTypes.length || '—'}</p>
                  <p className="text-xs font-semibold text-indigo-500 mt-1 uppercase tracking-wider">Accepted Exams</p>
                </div>
                <div className="text-center p-5 bg-violet-500/10 rounded-xl border border-violet-500/20">
                  <p className="text-3xl font-bold text-violet-400">{college.facilities?.labs_count || '—'}</p>
                  <p className="text-xs font-semibold text-violet-500 mt-1 uppercase tracking-wider">Labs</p>
                </div>
              </div>

              {/* Top Branches Placement Summary */}
              {college.placements?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-white mb-4">Branch Placement Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {college.placements.slice(0, 4).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div>
                          <p className="font-bold text-white">{p.branch}</p>
                          <p className="text-xs text-slate-400 mt-1">Avg: {formatPackage(p.avg_package)} · Highest: {formatPackage(p.highest_package)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.placement_pct >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : p.placement_pct >= 80 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {p.placement_pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== TAB 1: COURSES & CUTOFFS ========== */}
          {activeTab === 'courses' && (
            <div className="p-6">
              {/* Courses List */}
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400" /> Available Courses</h2>
              {college.courses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {college.courses.map((course, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                      <div>
                        <p className="font-bold text-white mb-1">{course.branch_name}</p>
                        <p className="text-sm text-slate-400">{course.duration} years · {course.total_seats} seats</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-400 text-sm">{formatFees(course.fees_per_year)}</p>
                        <p className="text-xs text-slate-500">per year</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 mb-8">No course data available.</p>
              )}

              {/* Trend Chart */}
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-400" /> Cutoff Trends (GEN)</h2>
              <div className="mb-6 flex flex-wrap gap-3">
                <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
                  className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {branches.map(b => <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>)}
                </select>
              </div>
              
              {trendData.length > 1 ? (
                <div className="h-72 w-full bg-slate-800/30 border border-slate-700 rounded-xl p-4 mb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                      <YAxis reversed stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      {examTypes.map((exam, idx) => (
                        <Line 
                          key={exam} 
                          type="monotone" 
                          dataKey={exam} 
                          stroke={idx % 2 === 0 ? "#818cf8" : "#34d399"} 
                          strokeWidth={3}
                          activeDot={{ r: 6 }} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-slate-500 mb-10">Not enough historical data to show trends for this branch.</p>
              )}

              {/* Cutoffs Section */}
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-400" /> Cutoff Ranks Data</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                  className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {years.map(y => <option key={y} value={y} className="bg-slate-900 text-white">Year: {y}</option>)}
                </select>
              </div>

              {Object.keys(cutoffsByExam).length > 0 ? (
                Object.entries(cutoffsByExam).map(([exam, cutoffs]) => (
                  <div key={exam} className="mb-6 bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> {exam}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700 bg-slate-800/40">
                            <th className="text-left py-3 px-4 text-slate-400 font-semibold">Category</th>
                            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Opening Rank</th>
                            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Closing Rank</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATEGORIES.map(cat => {
                            const row = cutoffs.find(c => c.category === cat);
                            if (!row) return null;
                            return (
                              <tr key={cat} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-4 font-medium">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                    cat === 'GEN' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                    cat === 'OBC' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                    cat === 'SC' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                    'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                                  }`}>{cat}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-slate-300">{row.opening_rank.toLocaleString('en-US')}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-white">{row.closing_rank.toLocaleString('en-US')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No cutoff data available for this selection.</p>
              )}
            </div>
          )}

          {/* ========== TAB 2: PLACEMENTS ========== */}
          {activeTab === 'placements' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-400" /> Placements by Branch</h2>
              {college.placements?.length > 0 ? (
                <div className="space-y-4">
                  {college.placements.map((p, i) => (
                    <div key={i} className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                        <h3 className="font-bold text-white text-lg">{p.branch}</h3>
                        <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${
                          p.placement_pct >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          p.placement_pct >= 80 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>{p.placement_pct}% placed</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Avg Package</p>
                          <p className="text-xl font-bold text-emerald-400">{formatPackage(p.avg_package)}</p>
                        </div>
                        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Highest Package</p>
                          <p className="text-xl font-bold text-amber-400">{formatPackage(p.highest_package)}</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700">
                        <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all" style={{ width: `${p.placement_pct}%` }} />
                      </div>
                      {p.top_recruiters?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Recruiters</p>
                          <div className="flex flex-wrap gap-2">
                            {p.top_recruiters.map((r, j) => (
                              <span key={j} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium">{r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No placement data available.</p>
              )}
            </div>
          )}

          {/* ========== TAB 3: ADMISSION CRITERIA ========== */}
          {activeTab === 'admission' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-400" /> Admission Criteria</h2>

              <div className="mb-8">
                <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Accepted Entrance Exams</h3>
                <div className="flex flex-wrap gap-3">
                  {examTypes.map(e => (
                    <span key={e} className="px-5 py-2.5 bg-indigo-500/10 text-indigo-300 rounded-xl text-sm font-bold border border-indigo-500/20 shadow-inner">{e}</span>
                  ))}
                  {examTypes.length === 0 && <p className="text-slate-500 text-sm">No exam data available.</p>}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Reservation Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className={`p-4 rounded-xl border bg-slate-800/50 text-center ${
                      cat === 'GEN' ? 'border-blue-500/30' :
                      cat === 'OBC' ? 'border-emerald-500/30' :
                      cat === 'SC' ? 'border-amber-500/30' :
                      'border-violet-500/30'
                    }`}>
                      <p className={`text-xl font-extrabold ${
                        cat === 'GEN' ? 'text-blue-400' :
                        cat === 'OBC' ? 'text-emerald-400' :
                        cat === 'SC' ? 'text-amber-400' :
                        'text-violet-400'
                      }`}>{cat}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        {cat === 'GEN' ? 'General' : cat === 'OBC' ? 'Other Backward Classes' : cat === 'SC' ? 'Scheduled Caste' : 'Scheduled Tribe'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========== TAB: ROI CALCULATOR ========== */}
          {activeTab === 'roi' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-400" /> Return on Investment Calculator</h2>
              <p className="text-slate-400 mb-8">Calculate your estimated timeline to recover your educational investment based on average placement packages.</p>
              
              {roiCalculations ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Inputs */}
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 space-y-5">
                    <h3 className="font-bold text-white border-b border-slate-700 pb-2 mb-4">Assumptions</h3>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1.5">Branch</label>
                      <select value={roiBranch} onChange={e => setRoiBranch(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {college.placements?.map(p => <option key={p.branch} value={p.branch} className="bg-slate-900 text-white">{p.branch}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1.5">Loan Interest Rate (%)</label>
                      <input type="number" step="0.1" value={loanInterest} onChange={e => setLoanInterest(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1.5">Loan Duration (Years)</label>
                      <input type="number" value={loanYears} onChange={e => setLoanYears(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  {/* Calculations Output */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-400 mb-1">Total Course Fee</p>
                      <p className="text-2xl font-bold text-white mb-4">{formatFees(roiCalculations.totalFees)} <span className="text-sm font-normal text-slate-500">for {roiCalculations.duration} yrs</span></p>
                      
                      <p className="text-sm font-semibold text-slate-400 mb-1">Total Loan Repayment</p>
                      <p className="text-2xl font-bold text-rose-400 mb-4">{formatFees(roiCalculations.totalRepayment)} <span className="text-sm font-normal text-slate-500">with interest</span></p>
                      
                      <p className="text-sm font-semibold text-slate-400 mb-1">Estimated Monthly EMI</p>
                      <p className="text-xl font-bold text-rose-300">{formatFees(roiCalculations.emi)}</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-400 mb-1">Expected Avg Package</p>
                      <p className="text-2xl font-bold text-emerald-400 mb-4">{roiCalculations.avgPackageLPA} LPA</p>
                      
                      <p className="text-sm font-semibold text-slate-400 mb-1">Est. Monthly Take-Home</p>
                      <p className="text-2xl font-bold text-emerald-300 mb-4">{formatFees(roiCalculations.monthlyTakeHome)} <span className="text-sm font-normal text-slate-500">after tax (~20%)</span></p>
                      
                      <p className="text-sm font-semibold text-slate-400 mb-1">Time to Recover Investment</p>
                      <p className="text-xl font-bold text-indigo-400">{(roiCalculations.paybackMonthsLoan / 12).toFixed(1)} years</p>
                    </div>

                    <div className="md:col-span-2 bg-indigo-500/10 rounded-xl p-5 border border-indigo-500/20 flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-1">AI Insight</h4>
                        <p className="text-sm text-indigo-200 leading-relaxed">
                          By investing {formatFees(roiCalculations.totalFees)} over {roiCalculations.duration} years, and assuming you secure an average placement of {roiCalculations.avgPackageLPA} LPA in the {roiBranch} branch, it will take approximately <strong>{(roiCalculations.paybackMonthsLoan / 12).toFixed(1)} years</strong> of your entire take-home salary to recover the cost of education (including loan interest). Most students distribute this over 5-7 years while covering living expenses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">ROI Calculation requires placement data which is currently unavailable.</p>
              )}
            </div>
          )}

          {/* ========== TAB 4: FACILITIES ========== */}
          {activeTab === 'facilities' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-400" /> Campus Facilities</h2>
              {college.facilities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FacilityCard icon={Home} label="Hostel" value={college.facilities.hostel ? 'Available' : 'Not Available'}
                    detail={college.facilities.hostel ? `Fees: ${formatFees(college.facilities.hostel_fees)}/year` : null}
                    color={college.facilities.hostel ? 'emerald' : 'red'} />
                  <FacilityCard icon={Wifi} label="Wi-Fi" value={college.facilities.wifi ? 'Campus-wide' : 'Not Available'}
                    color={college.facilities.wifi ? 'blue' : 'red'} />
                  <FacilityCard icon={Building2} label="Laboratories" value={`${college.facilities.labs_count} Labs`}
                    detail="Fully equipped research & teaching labs" color="purple" />
                  <FacilityCard icon={Library} label="Library" value={college.facilities.library ? 'Central Library' : 'Not Available'}
                    detail="Digital & physical resource center" color={college.facilities.library ? 'amber' : 'red'} />
                  <div className="md:col-span-2">
                    <FacilityCard icon={Dumbbell} label="Sports" value="Sports Facilities"
                      detail={college.facilities.sports} color="indigo" />
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No facility data available.</p>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up-delayed-2">
          <Link href="/predict" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 btn-premium bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all">
            <GraduationCap className="w-5 h-5" /> Check Your Chances
          </Link>
          <Link href="/compare" className="flex items-center justify-center gap-2 px-6 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-all">
            View Compare
          </Link>
        </div>
      </main>
      
      <CompareBar />
    </div>
  );
}

function FacilityCard({ icon: Icon, label, value, detail, color }) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`rounded-xl p-5 border ${c} backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-6 h-6 opacity-80" />
        <p className="font-extrabold text-white text-lg">{value}</p>
      </div>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      {detail && <p className="text-xs mt-1.5 opacity-70">{detail}</p>}
    </div>
  );
}
