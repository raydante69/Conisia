import React, { useState, useEffect } from 'react';
import { FileText, Users, Calendar, Shield, Search, Zap, Layout, Bot, Layers, Lock, Smartphone, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AI' | 'DOCS' | 'COLLAB'>('AI');
  const [typing, setTyping] = useState(true);

  // Animation loop for the AI typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTyping(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = {
    AI: {
      title: "Assistant Intelligent Gemini",
      desc: "Ne cherchez plus, demandez. Notre IA analyse le contenu de vos PDF, Excel et Word pour répondre à vos questions en langage naturel.",
      points: ["Recherche sémantique contextuelle", "Résumé automatique de documents", "Génération de plans d'action"],
      color: "from-emerald-500 to-teal-600",
      icon: <Bot className="w-6 h-6" />
    },
    DOCS: {
      title: "Gestion Documentaire 3.0",
      desc: "Centralisez tous vos documents RH, Tech et Marketing. Suivez les versions, ajoutez des tags intelligents et gérez les droits d'accès finement.",
      points: ["Reconnaissance optique (OCR)", "Historique des versions illimité", "Prévisualisation instantanée"],
      color: "from-blue-500 to-indigo-600",
      icon: <FileText className="w-6 h-6" />
    },
    COLLAB: {
      title: "Collaboration Temps Réel",
      desc: "Transformez des demandes en tâches concrètes. Créez des groupes de projet, chattez en direct et suivez l'avancement via des tableaux Kanban.",
      points: ["Tableaux Kanban interactifs", "Groupes de discussion privés", "Notifications intelligentes"],
      color: "from-orange-500 to-red-600",
      icon: <Users className="w-6 h-6" />
    }
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Une plateforme, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fealty-dark to-slate-600">des possibilités infinies</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Découvrez comment Conisia réinvente votre façon de travailler grâce à une suite d'outils interconnectés.
          </p>
        </div>

        {/* --- MAIN INTERACTIVE SHOWCASE --- */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-24 flex flex-col lg:flex-row">
            
            {/* Left: Navigation Tabs */}
            <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                <button 
                  onClick={() => setActiveTab('AI')}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 group border ${activeTab === 'AI' ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-100/50' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeTab === 'AI' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                        <Bot size={24} />
                    </div>
                    <h3 className={`font-bold text-lg mb-1 ${activeTab === 'AI' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>Intelligence Artificielle</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Analyse et synthèse de documents par Gemini Pro.</p>
                </button>

                <button 
                  onClick={() => setActiveTab('DOCS')}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 group border ${activeTab === 'DOCS' ? 'bg-white border-blue-200 shadow-xl shadow-blue-100/50' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeTab === 'DOCS' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        <FileText size={24} />
                    </div>
                    <h3 className={`font-bold text-lg mb-1 ${activeTab === 'DOCS' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>Gestion Documentaire</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Stockage sécurisé, versioning et partage avancé.</p>
                </button>

                <button 
                  onClick={() => setActiveTab('COLLAB')}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 group border ${activeTab === 'COLLAB' ? 'bg-white border-orange-200 shadow-xl shadow-orange-100/50' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeTab === 'COLLAB' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500 group-hover:bg-orange-50 group-hover:text-orange-600'}`}>
                        <Users size={24} />
                    </div>
                    <h3 className={`font-bold text-lg mb-1 ${activeTab === 'COLLAB' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>Collaboration</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Groupes, tâches et workflows intégrés.</p>
                </button>
            </div>

            {/* Right: Dynamic Content & Visuals */}
            <div className="lg:w-2/3 p-8 lg:p-16 relative overflow-hidden bg-white">
                 {/* Content Text */}
                 <div className="relative z-10 mb-12 animate-fade-in key={activeTab}">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 bg-slate-100 text-slate-600`}>
                        {features[activeTab].icon}
                        <span>Fonctionnalité Principale</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{features[activeTab].title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-xl mb-8">
                        {features[activeTab].desc}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {features[activeTab].points.map((point, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 size={18} className={`text-${activeTab === 'AI' ? 'emerald' : activeTab === 'DOCS' ? 'blue' : 'orange'}-500`} />
                                <span className="text-sm font-medium text-slate-700">{point}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* VISUAL MOCKUPS AREA */}
                 <div className="relative w-full h-[400px] bg-slate-50 rounded-3xl border border-slate-100 shadow-inner overflow-hidden group">
                     
                     {/* 1. AI CHAT MOCKUP */}
                     {activeTab === 'AI' && (
                         <div className="absolute inset-0 p-6 flex flex-col animate-slide-up">
                             <div className="flex-1 space-y-4">
                                 {/* User Message */}
                                 <div className="flex justify-end">
                                     <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] text-sm">
                                         Comment poser mes congés d'été ?
                                     </div>
                                 </div>
                                 {/* Bot Message */}
                                 <div className="flex justify-start items-start gap-3">
                                     <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><Bot size={16}/></div>
                                     <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] text-sm">
                                         <p className="mb-2">D'après le document <span className="font-bold text-emerald-600">Politique_RH_2024.pdf</span> :</p>
                                         <ul className="list-disc pl-4 space-y-1 text-xs text-slate-500">
                                             <li>Connectez-vous au portail RH.</li>
                                             <li>Allez dans "Mes Absences".</li>
                                             <li>Sélectionnez "Congés Payés".</li>
                                         </ul>
                                     </div>
                                 </div>
                                 {/* Typing Indicator */}
                                 {typing && (
                                     <div className="flex justify-start items-start gap-3 animate-pulse">
                                         <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><Bot size={16}/></div>
                                         <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"/>
                                             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '100ms'}}/>
                                             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}/>
                                         </div>
                                     </div>
                                 )}
                             </div>
                             {/* Input Bar */}
                             <div className="mt-4 bg-white p-2 rounded-full border border-slate-200 flex items-center shadow-sm">
                                 <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 ml-1"><Zap size={14}/></div>
                                 <div className="h-4 w-40 bg-slate-100 rounded-full ml-3 opacity-50"></div>
                                 <div className="ml-auto w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ArrowRight size={14}/></div>
                             </div>
                             {/* Decorative Blob */}
                             <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                         </div>
                     )}

                     {/* 2. DOCS MANAGER MOCKUP */}
                     {activeTab === 'DOCS' && (
                         <div className="absolute inset-0 p-6 animate-slide-up">
                             <div className="flex justify-between items-center mb-6">
                                 <div className="flex gap-2">
                                     <div className="h-2 w-2 rounded-full bg-red-400"/>
                                     <div className="h-2 w-2 rounded-full bg-yellow-400"/>
                                     <div className="h-2 w-2 rounded-full bg-green-400"/>
                                 </div>
                                 <div className="h-2 w-20 bg-slate-200 rounded-full"/>
                             </div>
                             {/* File Grid */}
                             <div className="grid grid-cols-3 gap-4">
                                 {[1, 2, 3, 4, 5, 6].map((i) => (
                                     <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-2 group/file">
                                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-red-50 text-red-500' : (i === 2 ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500')}`}>
                                             <FileText size={20} />
                                         </div>
                                         <div className="h-2 w-16 bg-slate-100 rounded-full group-hover/file:bg-slate-200 transition-colors"/>
                                         <div className="h-1.5 w-10 bg-slate-50 rounded-full"/>
                                     </div>
                                 ))}
                             </div>
                             {/* Floating "Upload" Toast */}
                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
                                 <CheckCircle2 size={14} className="text-green-400" />
                                 Upload terminé
                             </div>
                             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                         </div>
                     )}

                     {/* 3. COLLAB KANBAN MOCKUP */}
                     {activeTab === 'COLLAB' && (
                         <div className="absolute inset-0 p-6 flex gap-4 animate-slide-up overflow-hidden">
                             {/* Column 1 */}
                             <div className="w-1/2 bg-slate-100/50 rounded-2xl p-3 flex flex-col gap-3">
                                 <div className="h-2 w-12 bg-slate-200 rounded-full mb-2"/>
                                 <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                     <div className="flex justify-between mb-2">
                                         <div className="h-1.5 w-8 bg-orange-100 rounded-full"/>
                                         <div className="h-4 w-4 rounded-full bg-slate-100"/>
                                     </div>
                                     <div className="h-2 w-24 bg-slate-200 rounded-full mb-1"/>
                                     <div className="h-2 w-16 bg-slate-100 rounded-full"/>
                                 </div>
                                 <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 opacity-60">
                                     <div className="h-2 w-20 bg-slate-200 rounded-full mb-2"/>
                                 </div>
                             </div>
                             {/* Column 2 */}
                             <div className="w-1/2 bg-slate-100/50 rounded-2xl p-3 flex flex-col gap-3">
                                 <div className="h-2 w-12 bg-slate-200 rounded-full mb-2"/>
                                 {/* Moving Card */}
                                 <div className="bg-white p-3 rounded-xl shadow-lg border border-orange-100 transform translate-y-4 rotate-2 transition-transform">
                                     <div className="flex justify-between mb-2">
                                         <div className="h-1.5 w-8 bg-green-100 rounded-full"/>
                                         <div className="flex -space-x-1">
                                             <div className="h-4 w-4 rounded-full bg-red-200"/>
                                             <div className="h-4 w-4 rounded-full bg-blue-200"/>
                                         </div>
                                     </div>
                                     <div className="h-2 w-20 bg-slate-800 rounded-full mb-1"/>
                                     <div className="h-2 w-12 bg-slate-200 rounded-full"/>
                                 </div>
                             </div>
                             <div className="absolute -top-20 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                         </div>
                     )}
                 </div>
            </div>
        </div>

        {/* --- SECONDARY FEATURES GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sécurité Enterprise</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    SSO MyUnisoft intégré. Chiffrement de bout en bout et gestion des rôles (RBAC) pour protéger vos données sensibles.
                </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile First</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Accédez à votre hub depuis n'importe où. Une interface responsive pensée pour les collaborateurs sur le terrain.
                </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics RH</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Suivez l'engagement des équipes, les documents les plus consultés et optimisez votre communication interne.
                </p>
            </div>
        </div>

        <div className="mt-20 text-center">
            <Button variant="primary" onClick={() => (document.querySelector('nav button') as HTMLElement)?.click()}>
                Découvrir la plateforme
            </Button>
        </div>

      </div>
    </section>
  );
};
