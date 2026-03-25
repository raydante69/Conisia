import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';
import { LandingView } from '../types';

interface NavbarProps {
  onLoginClick: () => void;
  currentView: LandingView;
  onNavigate: (view: LandingView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, currentView, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (view: LandingView) => `
    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
    ${currentView === view 
      ? 'bg-slate-900 text-white font-bold shadow-md' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
  `;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
        
        {/* Creative Groove Style Logo */}
        <div className="flex flex-col justify-center cursor-pointer group" onClick={() => onNavigate('HOME')}>
            <span className="font-extrabold text-3xl tracking-tighter text-slate-900 leading-none group-hover:opacity-90 transition-opacity lowercase">
                conisia.
            </span>
            <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 rounded-full mt-1 group-hover:w-24 transition-all duration-300 ease-out" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => onNavigate('HOME')} className={navLinkClass('HOME')}>
            Accueil
          </button>
          <button onClick={() => onNavigate('FEATURES')} className={navLinkClass('FEATURES')}>
            Fonctionnalités
          </button>
          <button onClick={() => onNavigate('AI')} className={navLinkClass('AI')}>
            IA & Recherche
          </button>
          <button onClick={() => onNavigate('GROUPS')} className={navLinkClass('GROUPS')}>
            Groupes
          </button>
          <Button variant="primary" className="py-3 px-6 text-base ml-4" onClick={onLoginClick}>Connexion</Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 p-4 md:hidden flex flex-col gap-4 shadow-xl animate-fade-in">
          <button className="text-slate-600 p-2 font-medium text-left" onClick={() => { onNavigate('HOME'); setMobileMenuOpen(false); }}>Accueil</button>
          <button className="text-slate-600 p-2 font-medium text-left" onClick={() => { onNavigate('FEATURES'); setMobileMenuOpen(false); }}>Fonctionnalités</button>
          <button className="text-slate-600 p-2 font-medium text-left" onClick={() => { onNavigate('AI'); setMobileMenuOpen(false); }}>IA & Recherche</button>
          <button className="text-slate-600 p-2 font-medium text-left" onClick={() => { onNavigate('GROUPS'); setMobileMenuOpen(false); }}>Groupes</button>
          <Button className="w-full" variant="primary" onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}>Connexion</Button>
        </div>
      )}
    </nav>
  );
};