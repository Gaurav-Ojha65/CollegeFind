// FILE: frontend/pages/college/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { fetchCollege } from '../../lib/api';
import { useCompare } from '../../context/CompareContext';
import {
  MapPin, IndianRupee, Star, TrendingUp, ArrowLeft, Plus, Check, Loader2,
  AlertCircle, BookOpen, GraduationCap, Building2, Wifi, Dumbbell,
  Library, Home, Users, Award, ChevronDown, Eye, LayoutDashboard,
} from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'Courses & Cutoffs', icon: BookOpen },
  { key: 'placements', label: 'Placements', icon: TrendingUp },
  { key: 'admission', label: 'Admission Criteria', icon: GraduationCap },
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

  useEffect(() => {
    if (!id) return;
    const loadCollege = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCollege(id);
        setCollege(result);
        // Set defaults
        if (result.cutoffs?.length > 0) {
          const branches = [...new Set(result.cutoffs.map(c => c.branch))];
          setSelectedBranch(branches[0] || '');
          const years = [...new Set(result.cutoffs.map(c => c.year))].sort((a, b) => b - a);
          setSelectedYear(years[0]?.toString() || '');
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

  // Group cutoffs by exam_type
  const cutoffsByExam = {};
  filteredCutoffs.forEach(c => {
    if (!cutoffsByExam[c.exam_type]) cutoffsByExam[c.exam_type] = [];
    cutoffsByExam[c.exam_type].push(c);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Navbar />
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Loading college details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Unable to load college</h2>
            </div>
            <p className="text-red-700 mb-4">{error || 'College not found'}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Head>
        <title>{college.name} — CollegeFind</title>
        <meta name="description" content={`${college.name} in ${college.location} — Rating ${college.rating}/5, ${college.placement_percentage}% placement, fees ${formatFees(college.fees)}. View courses, cutoffs, placements & facilities.`} />
      </Head>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        {/* Hero Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{college.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{college.location}</span>
              </div>
            </div>
            <button
              onClick={() => addCollege(college.id)}
              disabled={isSelected}
              className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isSelected ? <><Check className="w-5 h-5" /> In Compare</> : <><Plus className="w-5 h-5" /> Compare</>}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-1"><IndianRupee className="w-4 h-4" /> Annual Fees</div>
              <p className="text-xl font-bold text-gray-900">{formatFees(college.fees)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium mb-1"><Star className="w-4 h-4" /> Rating</div>
              <p className="text-xl font-bold text-gray-900">{college.rating} / 5.0</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-1"><TrendingUp className="w-4 h-4" /> Placement</div>
              <p className="text-xl font-bold text-gray-900">{college.placement_percentage}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-1"><Users className="w-4 h-4" /> Courses</div>
              <p className="text-xl font-bold text-gray-900">{college.courses?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 overflow-x-auto shadow-sm">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          {/* ========== TAB: OVERVIEW ========== */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-indigo-600" /> College Overview</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {college.name} is located in {college.location} with an overall rating of <strong>{college.rating}/5.0</strong>.
                The institution offers <strong>{college.courses?.length || 0} engineering branches</strong> with
                a placement rate of <strong>{college.placement_percentage}%</strong> and annual fees starting at <strong>{formatFees(college.fees)}</strong>.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-100">
                  <p className="text-3xl font-bold text-emerald-700">{college.courses?.length || 0}</p>
                  <p className="text-xs font-medium text-emerald-600 mt-1">Branches</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-100">
                  <p className="text-3xl font-bold text-amber-700">{years.length * 12 || '—'}</p>
                  <p className="text-xs font-medium text-amber-600 mt-1">Cutoff Records</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-100">
                  <p className="text-3xl font-bold text-indigo-700">{examTypes.length || '—'}</p>
                  <p className="text-xs font-medium text-indigo-600 mt-1">Accepted Exams</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <p className="text-3xl font-bold text-purple-700">{college.facilities?.labs_count || '—'}</p>
                  <p className="text-xs font-medium text-purple-600 mt-1">Labs</p>
                </div>
              </div>

              {/* Top Branches Placement Summary */}
              {college.placements?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3">Branch Placement Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {college.placements.slice(0, 4).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-semibold text-gray-900">{p.branch}</p>
                          <p className="text-xs text-gray-500">Avg: {formatPackage(p.avg_package)} · Highest: {formatPackage(p.highest_package)}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.placement_pct >= 90 ? 'bg-emerald-100 text-emerald-700' : p.placement_pct >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{p.placement_pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TABS.filter(t => t.key !== 'overview').map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========== TAB 1: COURSES & CUTOFFS ========== */}
          {activeTab === 'courses' && (
            <div className="p-6">
              {/* Courses List */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" /> Available Courses</h2>
              {college.courses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {college.courses.map((course, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-900">{course.branch_name}</p>
                        <p className="text-sm text-gray-500">{course.duration} years · {course.total_seats} seats</p>
                      </div>
                      <p className="font-bold text-indigo-600 text-sm">{formatFees(course.fees_per_year)}/yr</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-8">No course data available.</p>
              )}

              {/* Cutoffs Section */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-600" /> Cutoff Ranks</h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {Object.keys(cutoffsByExam).length > 0 ? (
                Object.entries(cutoffsByExam).map(([exam, cutoffs]) => (
                  <div key={exam} className="mb-6">
                    <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">{exam}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2.5 px-3 text-gray-500 font-semibold">Category</th>
                            <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">Opening Rank</th>
                            <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">Closing Rank</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATEGORIES.map(cat => {
                            const row = cutoffs.find(c => c.category === cat);
                            if (!row) return null;
                            return (
                              <tr key={cat} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-3 font-medium text-gray-900">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                                    cat === 'GEN' ? 'bg-blue-100 text-blue-700' :
                                    cat === 'OBC' ? 'bg-green-100 text-green-700' :
                                    cat === 'SC' ? 'bg-amber-100 text-amber-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>{cat}</span>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-gray-700">{row.opening_rank.toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">{row.closing_rank.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No cutoff data available for this selection.</p>
              )}
            </div>
          )}

          {/* ========== TAB 2: PLACEMENTS ========== */}
          {activeTab === 'placements' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-600" /> Placements by Branch</h2>
              {college.placements?.length > 0 ? (
                <div className="space-y-4">
                  {college.placements.map((p, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">{p.branch}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.placement_pct >= 90 ? 'bg-emerald-100 text-emerald-700' :
                          p.placement_pct >= 80 ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{p.placement_pct}% placed</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-lg p-3">
                          <p className="text-xs text-emerald-600 font-medium mb-1">Avg Package</p>
                          <p className="text-lg font-bold text-gray-900">{formatPackage(p.avg_package)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-lg p-3">
                          <p className="text-xs text-amber-600 font-medium mb-1">Highest Package</p>
                          <p className="text-lg font-bold text-gray-900">{formatPackage(p.highest_package)}</p>
                        </div>
                      </div>
                      {/* Placement bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all" style={{ width: `${p.placement_pct}%` }} />
                      </div>
                      {/* Recruiters */}
                      {p.top_recruiters?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top Recruiters</p>
                          <div className="flex flex-wrap gap-2">
                            {p.top_recruiters.map((r, j) => (
                              <span key={j} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No placement data available.</p>
              )}
            </div>
          )}

          {/* ========== TAB 3: ADMISSION CRITERIA ========== */}
          {activeTab === 'admission' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-600" /> Admission Criteria</h2>

              {/* Accepted Exams */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Accepted Entrance Exams</h3>
                <div className="flex flex-wrap gap-2">
                  {examTypes.map(e => (
                    <span key={e} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-100">{e}</span>
                  ))}
                  {examTypes.length === 0 && <p className="text-gray-500 text-sm">No exam data available.</p>}
                </div>
              </div>

              {/* Reservation Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Reservation Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className={`p-4 rounded-xl border text-center ${
                      cat === 'GEN' ? 'bg-blue-50 border-blue-100' :
                      cat === 'OBC' ? 'bg-green-50 border-green-100' :
                      cat === 'SC' ? 'bg-amber-50 border-amber-100' :
                      'bg-purple-50 border-purple-100'
                    }`}>
                      <p className="font-bold text-gray-900">{cat}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {cat === 'GEN' ? 'General' : cat === 'OBC' ? 'Other Backward Classes' : cat === 'SC' ? 'Scheduled Caste' : 'Scheduled Tribe'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rank Range Summary */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Rank Range Summary (Latest Year)</h3>
                {branches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2.5 px-3 text-gray-500 font-semibold">Branch</th>
                          <th className="text-left py-2.5 px-3 text-gray-500 font-semibold">Exam</th>
                          <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">GEN Closing</th>
                          <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">OBC Closing</th>
                          <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">SC Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map(branch =>
                          examTypes.map(exam => {
                            const latestYear = years[0];
                            const getClosing = (cat) => {
                              const row = college.cutoffs?.find(c => c.branch === branch && c.exam_type === exam && c.category === cat && c.year === latestYear);
                              return row ? row.closing_rank.toLocaleString() : '—';
                            };
                            return (
                              <tr key={`${branch}-${exam}`} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-2.5 px-3 font-medium text-gray-900">{branch}</td>
                                <td className="py-2.5 px-3 text-gray-600">{exam}</td>
                                <td className="py-2.5 px-3 text-right font-mono">{getClosing('GEN')}</td>
                                <td className="py-2.5 px-3 text-right font-mono">{getClosing('OBC')}</td>
                                <td className="py-2.5 px-3 text-right font-mono">{getClosing('SC')}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No admission data available.</p>
                )}
              </div>
            </div>
          )}

          {/* ========== TAB 4: FACILITIES ========== */}
          {activeTab === 'facilities' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-600" /> Campus Facilities</h2>
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
                <p className="text-gray-500">No facility data available.</p>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/predict" className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
            <GraduationCap className="w-5 h-5" /> Check Your Chances
          </Link>
          <Link href="/compare" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
            View Compare
          </Link>
        </div>
      </main>
    </div>
  );
}

function FacilityCard({ icon: Icon, label, value, detail, color }) {
  const colorMap = {
    emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600',
    blue: 'from-blue-50 to-blue-100/50 border-blue-100 text-blue-600',
    purple: 'from-purple-50 to-purple-100/50 border-purple-100 text-purple-600',
    amber: 'from-amber-50 to-amber-100/50 border-amber-100 text-amber-600',
    indigo: 'from-indigo-50 to-indigo-100/50 border-indigo-100 text-indigo-600',
    red: 'from-red-50 to-red-100/50 border-red-100 text-red-600',
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`bg-gradient-to-br ${c} rounded-xl p-5 border`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5" />
        <p className="font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
    </div>
  );
}
