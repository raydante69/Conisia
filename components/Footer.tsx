import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo */}
          <div className="flex flex-col justify-center cursor-pointer group">
              <span className="font-extrabold text-3xl tracking-tighter text-white leading-none lowercase">
                  conisia.
              </span>
              <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 rounded-full mt-1 group-hover:w-24 transition-all duration-300 ease-out" />
          </div>

          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Accueil</a>
            <a href="#" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div className="text-xs opacity-60">
            &copy; {new Date().getFullYear()} MyUnisoft. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};