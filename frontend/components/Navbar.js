// FILE: frontend/components/Navbar.js
import Link from 'next/link';
import { GraduationCap, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <GraduationCap className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <span className="text-xl font-bold text-indigo-900 hidden sm:block">CollegeFind</span>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main navigation">
              <Link
                href="/"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1 hidden sm:block"
              >
                Browse
              </Link>
              <Link
                href="/compare"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1 hidden sm:block"
              >
                Compare
              </Link>
              <Link
                href="/predict"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              >
                Predictor
              </Link>
              
              <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block">{user.name}</span>
                  </Link>
                  <button onClick={logout} className="text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
