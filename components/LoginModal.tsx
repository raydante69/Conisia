import React, { useState } from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
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
             <p className="text-slate-400 text-sm">Connectez-vous avec votre compte Google MyUnisoft</p>
          </div>

          <div className="mt-8 text-center">
             <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
             >
                {isLoading ? 'Connexion...' : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Continuer avec Google
                  </>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};