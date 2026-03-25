import React, { useState } from 'react';
import { Button } from './Button';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Static Dark Modal */}
      <div className="relative w-full max-w-md bg-conisia-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
             <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <Lock className="text-red-500 w-8 h-8" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
             <p className="text-slate-400 text-sm">Entrez vos identifiants MyUnisoft</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email Professionnel</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@myunisoft.fr"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Mot de passe</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
               </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
               <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input type="checkbox" className="rounded border-slate-700 bg-white/10 text-red-500 focus:ring-offset-slate-900" />
                  Se souvenir de moi
               </label>
               <a href="#" className="hover:text-red-500 transition-colors">Mot de passe oublié ?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-red-900 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? 'Connexion...' : (
                 <>Se connecter <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
             <button type="button" onClick={handleSubmit} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-3">
                <img src="https://www.google.com/favicon.ico" alt="SSO" className="w-5 h-5" />
                Continuer avec SSO MyUnisoft
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};