import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import Navbar from '../components/Navbar';
import CollegeCard from '../components/CollegeCard';
import Head from 'next/head';
import { User, Heart, Bookmark, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CompareBar from '../components/CompareBar';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { savedColleges, loading: savedLoading } = useSaved();
  const { selectedIds, toggleCollege } = useCompare();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <p className="text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816]">
      <Head><title>Dashboard — CollegeFind</title></Head>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex justify-center items-center shadow-lg shadow-indigo-500/20">
              <span className="text-2xl font-extrabold text-white">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Welcome, <span className="gradient-text">{user.name}</span></h1>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Saved Colleges Section */}
        <div className="animate-slide-up-delayed">
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Saved Colleges ({savedColleges.length})</h2>
          </div>

          {savedLoading ? (
            <div className="text-center py-12"><p className="text-slate-400">Loading saved colleges...</p></div>
          ) : savedColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedColleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isSelected={selectedIds.includes(college.id)}
                  onSelect={() => toggleCollege(college.id)}
                  onViewDetails={() => router.push(`/college/${college.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-2xl text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex justify-center items-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No saved colleges yet</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">Browse colleges or use the predictor to find and save your favorite colleges.</p>
              <button onClick={() => router.push('/')} className="btn-premium inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300">
                <Sparkles className="w-4 h-4" /> Browse Colleges
              </button>
            </div>
          )}
        </div>
      </main>

      <CompareBar />
    </div>
  );
}
