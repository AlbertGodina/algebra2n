import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-brand-500/30 shadow-lg group-hover:scale-110 transition-transform">
            x
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">Algebra<span className="text-brand-600">Master</span></span>
        </a>
        
        <div className="flex gap-4">
          <a href="#/exam" className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            Mode Examen
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
