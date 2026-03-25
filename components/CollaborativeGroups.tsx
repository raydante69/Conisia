import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ArrowRight, Lock, CheckCircle, MessageCircle } from 'lucide-react';

export const CollaborativeGroups: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGroupClick = () => {
      (document.querySelector('nav button') as HTMLElement)?.click(); 
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="groups">
       
       {/* Background Glows */}
       <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-100/50 rounded-full blur-[100px] pointer-events-none" />
       <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             
             {/* Left Visual Composition - Card Stack with Parallax & Hover Animation */}
             <div 
                ref={containerRef}
                className="relative h-[500px] flex items-center justify-center group cursor-pointer [perspective:1000px]" 
                onClick={handleGroupClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
             >
                
                {/* Back Card (Decorative) */}
                <div 
                    className="absolute w-[360px] h-[240px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] opacity-30 blur-sm transition-all duration-500 ease-out group-hover:translate-x-8 group-hover:rotate-6" 
                    style={{
                        transform: `
                            rotate(${-12 + (mousePos.x * 5)}deg) 
                            translateY(${32 + (mousePos.y * 10)}px) 
                            translateX(${mousePos.x * 20}px)
                        `
                    }}
                />

                {/* Middle Card (Glass) */}
                <div 
                    className="absolute w-[380px] h-[250px] bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-[2rem] shadow-lg transition-all duration-500 ease-out group-hover:translate-x-4 group-hover:rotate-3" 
                    style={{
                        transform: `
                            rotate(${-6 + (mousePos.x * 8)}deg) 
                            translateY(${16 + (mousePos.y * 15)}px) 
                            translateX(${mousePos.x * 30}px)
                        `
                    }}
                />

                {/* Front Main Card */}
                <div 
                    className="relative w-[420px] bg-slate-900 text-white rounded-[2rem] border border-white/10 shadow-2xl p-8 transform transition-all duration-200 ease-out hover:scale-[1.02] z-10"
                    style={{
                        transform: `
                            rotate(${mousePos.x * 5}deg)
                            translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)
                        `
                    }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20" />
                            <div>
                                <p className="font-bold text-xl">Projet Marketing</p>
                                <p className="text-sm text-slate-400">Groupe Privé</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                           <Lock size={18} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Body Items */}
                    <div className="space-y-3 mb-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3 group-hover:bg-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <MessageCircle size={14} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Document</p>
                                <p className="text-sm font-medium">Campagne Q4.pdf</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3 group-hover:bg-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle size={14} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Réunion</p>
                                <p className="text-sm font-medium">Demain 14h00</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                         <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white overflow-hidden">
                                   <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="" className="w-full h-full object-cover opacity-80" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-conisia-purple flex items-center justify-center text-xs font-bold shadow-lg z-10">
                                +5
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20">
                            Actif
                        </div>
                    </div>

                    {/* Shiny overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
                </div>
             </div>

             {/* Right Content */}
             <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900">
                   Créez vos propres <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-orange-400">
                      groupes privés
                   </span>
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
                   Espaces dédiés par équipe ou projet. Cliquez pour entrer dans une discussion, partager des fichiers et collaborer en temps réel.
                </p>

                <ul className="space-y-4 mb-10">
                   {["Chat en temps réel", "Espaces dédiés par équipe", "Échanges privés sécurisés", "Accessible sur invitation unique"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                            <CheckCircle size={14} />
                         </div>
                         <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                   ))}
                </ul>

                <div className="flex gap-4">
                   <Button variant="primary" onClick={handleGroupClick} className="shadow-lg shadow-red-500/20">Créer un espace</Button>
                   <Button variant="outline" className="border-slate-200">En savoir plus <ArrowRight size={16} /></Button>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};