// FILE: frontend/components/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GraduationCap, User, LogOut, Menu, X, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Browse' },
    { href: '/compare', label: 'Compare' },
    { href: '/predict', label: 'Predictor' },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-black/10 border-b border-indigo-500/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold hidden sm:block">
                <span className="text-white">College</span>
                <span className="gradient-text">Find</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-white bg-indigo-500/15'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved</span>
                  </Link>
                  <div className="w-px h-5 bg-slate-700" />
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-slate-400 hover:text-white font-medium transition-colors text-sm px-3 py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-premium bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-slate-700/50 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? 'text-white bg-indigo-500/15'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-700/50 my-2" />
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5">Log in</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
