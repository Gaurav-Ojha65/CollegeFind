// FILE: frontend/components/Navbar.js
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
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
              <span className="text-xl font-bold text-indigo-900">CollegeFind</span>
            </Link>

            <nav className="flex items-center gap-6" aria-label="Main navigation">
              <Link
                href="/"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              >
                Browse
              </Link>
              <Link
                href="/compare"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              >
                Compare
              </Link>
              <Link
                href="/predict"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              >
                Predictor
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
