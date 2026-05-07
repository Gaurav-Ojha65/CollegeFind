import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import Navbar from '../components/Navbar';
import CollegeCard from '../components/CollegeCard';
import Head from 'next/head';
import { User, Heart, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <Head><title>Dashboard — CollegeFind</title></Head>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex justify-center items-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-red-50" />
            <h2 className="text-xl font-bold text-gray-900">Saved Colleges ({savedColleges.length})</h2>
          </div>

          {savedLoading ? (
             <div className="text-center py-12"><p className="text-gray-500">Loading saved colleges...</p></div>
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
            <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No saved colleges yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">Browse colleges or use the predictor to find and save your favorite colleges.</p>
              <button onClick={() => router.push('/')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Browse Colleges
              </button>
            </div>
          )}
        </div>
      </main>

      <CompareBar />
    </div>
  );
}
