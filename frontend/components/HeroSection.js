// FILE: frontend/components/HeroSection.js
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  GraduationCap, Target, TrendingUp, Award, ArrowRight,
  Sparkles, Building2, Users, BookOpen,
} from 'lucide-react';

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-US')}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const stats = [
    { icon: Building2, value: 30, suffix: '+', label: 'Top Colleges', color: 'from-indigo-500 to-violet-500' },
    { icon: BookOpen, value: 4, suffix: '', label: 'Branches', color: 'from-cyan-500 to-blue-500' },
    { icon: Users, value: 50000, suffix: '+', label: 'Cutoff Records', color: 'from-emerald-500 to-teal-500' },
    { icon: Award, value: 95, suffix: '%', label: 'Accuracy', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <section className="hero-gradient relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Animated floating orbs */}
      <div
        className="orb w-[500px] h-[500px] bg-indigo-600 top-[-10%] left-[-5%] animate-float"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      />
      <div
        className="orb w-[400px] h-[400px] bg-purple-600 bottom-[-10%] right-[-5%] animate-float-delayed"
        style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
      />
      <div
        className="orb w-[300px] h-[300px] bg-cyan-500 top-[30%] right-[20%] animate-pulse-slow"
        style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="animate-slide-up mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            India's Most Intelligent College Discovery Platform
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="animate-slide-up-delayed text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          <span className="text-white">Find Your</span>
          <br />
          <span className="gradient-text">Dream College</span>
        </h1>

        {/* Subheading */}
        <p className="animate-slide-up-delayed-2 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Analyze placement trends, compare fees across 30+ top engineering colleges,
          and predict your admission chances with <span className="text-indigo-400 font-semibold">AI-powered cutoff analysis</span>.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up-delayed-2 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => router.push('/predict')}
            className="btn-premium group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
          >
            <Target className="w-5 h-5" />
            Predict My Colleges
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('explore-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 px-8 py-4 glass text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            <GraduationCap className="w-5 h-5" />
            Explore Colleges
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`glass-card rounded-2xl p-5 text-center animate-scale-in stagger-${idx + 1} group hover:scale-105 transition-all duration-300 cursor-default`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none" />
    </section>
  );
}
