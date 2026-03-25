import React from 'react';
import { Button } from './Button';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative w-full pt-32 pb-20 px-4 sm:px-8 lg:px-16 overflow-hidden min-h-screen flex items-center">
      
      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content - Typography & CTA */}
        <div className="space-y-10 animate-slide-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-red-600"></span>
               <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Intranet 3.0</span>
           </div>

           <h1 
             className="text-6xl lg:text-[5.5rem] font-bold text-slate-900 leading-[1.05] tracking-tight opacity-0 animate-title-entrance"
             style={{ animationDelay: '0.3s' }}
           >
              Profitez de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-orange-400">
                Hub Central
              </span> <br />
              profitez de votre travail
           </h1>
           
           <p className="text-lg text-slate-500 max-w-md leading-relaxed">
             La meilleure solution pour gérer vos ressources MyUnisoft. Centralisation, IA générative et collaboration en un seul endroit.
           </p>

           <div className="flex flex-wrap items-center gap-6">
             <Button 
                onClick={onCtaClick} 
                variant="primary" 
                className="px-8 py-4 text-lg shadow-xl shadow-red-500/20"
             >
               Accéder au Hub
             </Button>
             <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 font-semibold text-slate-800 hover:text-red-600 transition-colors"
             >
               Comment ça marche <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

        {/* Right Content - Abstract Composition (Kard Style) */}
        <div className="relative h-[600px] hidden lg:block perspective-1000">
           
           {/* Decorative Orbiting Rings */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-slate-200 rounded-full animate-spin-slow opacity-60" style={{borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'}}></div>
           <div className="absolute bottom-0 right-20 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[80px]"></div>

           {/* The "Holographic" Card */}
           <div 
             className="absolute top-10 right-10 w-[420px] h-[260px] rounded-[3rem] bg-gradient-to-br from-white via-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-2xl z-20 animate-float flex flex-col justify-between p-8 hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden group"
             onClick={onCtaClick}
           >
              {/* Iridescent overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fiche Employé</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">Thomas Anderson</h3>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse"></div>
                 </div>
              </div>

              <div className="relative z-10">
                 <p className="font-mono text-slate-400 text-lg tracking-widest mb-1">•••• •••• •••• 4289</p>
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full">STAFF</span>
                    <span className="text-sm font-bold text-slate-800">12/26</span>
                 </div>
              </div>

              {/* Decorative shapes on card */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-400 rounded-full blur-2xl opacity-20"></div>
           </div>

           {/* Floating "Green" Shape */}
           <div className="absolute top-[-20px] right-[140px] z-10 animate-float-delayed">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0Z" fill="#C0F264"/>
                 <path d="M50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50C20 33.4315 33.4315 20 50 20Z" fill="#E2FCA4"/>
              </svg>
           </div>

           {/* Floating Stats Widget */}
           <div className="absolute bottom-20 left-10 z-30 animate-float" style={{animationDelay: '1s'}}>
              <div className="bg-white/90 backdrop-blur-md p-4 pr-8 rounded-2xl shadow-xl border border-white flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-red-400">
                    <Play fill="currentColor" size={20} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Tutoriels</p>
                    <p className="text-lg font-bold text-slate-800">25k Vues</p>
                 </div>
              </div>
           </div>

           {/* Star/Sparkles */}
           <div className="absolute top-1/2 left-0 text-red-400 animate-spin-slow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
           </div>
           <div className="absolute bottom-10 right-0 text-orange-400 animate-pulse">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
           </div>
        </div>
      </div>
    </section>
  );
};