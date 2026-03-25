import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'white';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false
}) => {
  // Removed text-white from base style to allow variants to control text color
  const baseStyle = "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2";
  
  let variantStyles = "";
  
  switch (variant) {
    case 'primary':
      // Premium Red/Orange Gradient - White Text
      // REMOVED "border border-transparent" to fix the black line issue
      variantStyles = "bg-gradient-to-r from-red-700 via-red-500 to-orange-400 shadow-lg hover:shadow-xl hover:shadow-red-500/30 text-white";
      break;
    case 'secondary':
      // Dark Slate - White text
      variantStyles = "bg-slate-800 shadow-lg hover:shadow-xl hover:shadow-slate-800/30 hover:bg-slate-700 border border-slate-700 text-white";
      break;
    case 'outline':
      // Outline - White text request forced dark background
      variantStyles = "bg-slate-900 border-2 border-slate-900 text-white hover:bg-slate-800 shadow-lg";
      break;
    case 'glass':
      variantStyles = "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-lg";
      break;
    case 'white':
      // White background, Black text (as requested for Groups)
      variantStyles = "bg-white text-slate-900 border border-slate-200 shadow-md hover:shadow-lg hover:bg-slate-50";
      break;
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variantStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};