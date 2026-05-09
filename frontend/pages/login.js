import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { LogIn, AlertCircle, Mail, Lock, Sparkles } from 'lucide-react';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      <Head><title>Login — CollegeFind</title></Head>

      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-indigo-600 top-[10%] left-[10%] animate-float" />
      <div className="orb w-[300px] h-[300px] bg-violet-600 bottom-[10%] right-[15%] animate-float-delayed" />

      <Navbar />
      <div className="flex justify-center items-center py-20 px-4 pt-28 relative z-10">
        <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-scale-in">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex justify-center items-center mb-4 shadow-lg shadow-indigo-500/20">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-1 text-sm">Login to your CollegeFind account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm font-medium">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-premium w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 mt-2">
              <Sparkles className="w-4 h-4" /> Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account? <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
