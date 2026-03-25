import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', dark = false }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-3xl border 
      ${dark 
        ? 'bg-slate-900/60 border-white/10 text-white' 
        : 'bg-white/60 border-white/40 text-slate-800'
      }
      backdrop-blur-xl shadow-xl
      ${className}
    `}>
      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};