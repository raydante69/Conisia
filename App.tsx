import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { IntelligentSearch } from './components/IntelligentSearch';
import { CollaborativeGroups } from './components/CollaborativeGroups';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './components/Dashboard';
import { ProfileSetup } from './components/ProfileSetup';
import { FeaturesPage, AiPage, GroupsPage } from './components/LandingPages';
import { ViewState, LandingView } from './types';
import { DataProvider, useData } from './contexts/DataContext';

const MainApp: React.FC = () => {
  const { currentUser, login, logout } = useData();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [landingView, setLandingView] = useState<LandingView>('HOME');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = () => {
    // Simulate email from login
    login('employe@myunisoft.fr');
    setIsLoginModalOpen(false);
    setCurrentView('dashboard');
    window.scrollTo(0,0);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
    setLandingView('HOME');
    window.scrollTo(0,0);
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0,0);
  };

  const navigateLanding = (view: LandingView) => {
      setLandingView(view);
      window.scrollTo(0,0);
  };

  // --- Authenticated State ---

  if (currentUser) {
    if (!currentUser.onboardingCompleted) {
      return <ProfileSetup />;
    }

    return (
      <Dashboard 
        user={currentUser} 
        currentView={currentView} 
        onNavigate={navigateTo} 
        onLogout={handleLogout} 
      />
    );
  }

  // --- Landing Page Content Switcher ---

  const renderLandingContent = () => {
      switch(landingView) {
          case 'FEATURES': return <FeaturesPage onNavigate={navigateLanding} />;
          case 'AI': return <AiPage onNavigate={navigateLanding} />;
          case 'GROUPS': return <GroupsPage onNavigate={navigateLanding} />;
          case 'HOME':
          default:
              return (
                <main>
                    <Hero onCtaClick={() => setIsLoginModalOpen(true)} />
                    
                    <div className="bg-conisia-dark py-12 overflow-hidden border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 hover:opacity-100 transition-opacity duration-700">
                        <span className="text-white font-bold text-xl tracking-[0.2em] cursor-default">MYUNISOFT</span>
                        <span className="text-white font-bold text-xl tracking-[0.2em] cursor-default">RH</span>
                        <span className="text-white font-bold text-xl tracking-[0.2em] cursor-default">MARKETING</span>
                        <span className="text-white font-bold text-xl tracking-[0.2em] cursor-default">SUPPORT</span>
                        <span className="text-white font-bold text-xl tracking-[0.2em] cursor-default">DEV</span>
                    </div>
                    </div>

                    <Features />
                    
                    <section className="py-32 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                    {/* Decorative Blob */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-conisia-lime/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="order-2 md:order-1 relative group cursor-pointer" onClick={() => setIsLoginModalOpen(true)}>
                            <div className="absolute inset-0 bg-conisia-purple/20 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse" />
                            {/* Updated Mobile App Image */}
                            <img 
                            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1000" 
                            alt="Mobile App" 
                            className="relative z-10 rounded-[2.5rem] shadow-2xl border-8 border-white mx-auto w-[280px] md:w-[320px] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-conisia-purple/30" 
                            />
                            {/* Floating UI Elements - z-index increased */}
                            <div className="absolute top-20 -left-10 bg-white p-4 rounded-2xl shadow-xl animate-float-delayed hidden md:block z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    </div>
                                    <div>
                                    <p className="font-bold text-slate-800">Tâche terminée</p>
                                    <p className="text-xs text-slate-500">Validation RH</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-8">
                            <h2 className="text-5xl font-bold leading-tight">Emportez Conisia <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-conisia-purple to-indigo-500">dans votre poche</span></h2>
                            <p className="text-slate-500 text-lg leading-relaxed">
                            Une application mobile friendly pour supporter votre gestion documentaire. 
                            Accédez à l'agenda, aux actualités et à vos groupes privés où que vous soyez.
                            </p>
                            <div className="flex gap-4">
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-xl">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xl"></div>
                                <div className="text-xs text-left">
                                <div className="opacity-60">Download on the</div>
                                <div className="text-base font-bold leading-none">App Store</div>
                                </div>
                            </button>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-xl">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xl">▶</div>
                                <div className="text-xs text-left">
                                <div className="opacity-60">Get it on</div>
                                <div className="text-base font-bold leading-none">Google Play</div>
                                </div>
                            </button>
                            </div>
                        </div>
                    </div>
                    </section>

                    <IntelligentSearch />
                    
                    <CollaborativeGroups />
                    
                    <section className="py-24 bg-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h2 className="text-4xl font-bold mb-4">L'avis des collaborateurs</h2>
                        <p className="text-slate-400 mb-16">Ce qu'ils pensent du Hub MyUnisoft</p>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 text-left hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 ring-4 ring-white shadow-lg" style={{backgroundImage: `url(https://picsum.photos/50?random=${i+10})`, backgroundSize: 'cover'}} />
                                    <div>
                                        <p className="font-bold text-slate-900">Utilisateur {i}</p>
                                        <p className="text-xs font-semibold text-conisia-purple">Service {['Compta', 'Marketing', 'Dev'][i-1]}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed italic">"Conisia a transformé ma façon de travailler. L'accès instantané aux documents et la recherche IA me font gagner un temps précieux chaque jour."</p>
                                
                                <div className="mt-auto pt-6 flex gap-1 text-yellow-400 text-sm">
                                    ★★★★★
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    </section>
                </main>
              );
      }
  };

  return (
    <div className="font-sans text-slate-900 selection:bg-conisia-purple selection:text-white relative">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        currentView={landingView}
        onNavigate={navigateLanding}
      />
      
      {renderLandingContent()}

      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
};

export default App;