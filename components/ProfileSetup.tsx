import React, { useState, useRef, useMemo } from 'react';
import { Button } from './Button';
import { DEPARTMENTS, Department } from '../types';
import { Check, ArrowRight, User, Briefcase, ChevronLeft, Upload, Loader2, Sparkles, Image as ImageIcon, Palette } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { analyzeImageContent } from '../services/geminiService';

export const ProfileSetup: React.FC = () => {
  const { updateProfile } = useData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    department: DEPARTMENTS[0] as Department,
    avatar: ''
  });

  // Upload & AI Analysis State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Avatar Builder State
  const [selectedSeed, setSelectedSeed] = useState<string>('Alex');
  const [avatarBg, setAvatarBg] = useState<string>('e5e7eb');
  
  const [aiDescription, setAiDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-defined Seeds
  const AVATAR_SEEDS = ["Alex", "Jordan", "Taylor", "Casey", "Jamie", "Riley", "Morgan", "Drew", "Sam", "Avery"];
  
  // Background Colors
  const BG_COLORS = [
      "e5e7eb", // Gray
      "fca5a5", // Red
      "fdba74", // Orange
      "fcd34d", // Amber
      "bef264", // Lime
      "86efac", // Green
      "67e8f9", // Cyan
      "93c5fd", // Blue
      "c4b5fd", // Violet
      "f0abfc"  // Fuchsia
  ];

  // Generate Current Avatar URL based on state
  const currentAvatarUrl = useMemo(() => {
      if (uploadedImage) return uploadedImage;
      return `https://api.dicebear.com/9.x/notionists/svg?seed=${selectedSeed}&backgroundColor=${avatarBg}`;
  }, [uploadedImage, selectedSeed, avatarBg]);

  const handleSubmit = () => {
    updateProfile({
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      department: formData.department,
      skills: [], 
      currentProjects: [],
      avatar: currentAvatarUrl,
      onboardingCompleted: true
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // AI Analysis
    setIsAnalyzing(true);
    setAiDescription('');
    
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // Set uploaded image to base64 string for saving to Firestore
                setUploadedImage(dataUrl);
                setFormData(prev => ({ ...prev, avatar: dataUrl }));

                // Remove data:image/xxx;base64, prefix for Gemini
                const base64Data = dataUrl.split(',')[1];
                
                const result = await analyzeImageContent(base64Data, file.type);
                setAiDescription(result);
                setIsAnalyzing(false);
            };
        };
    } catch (error) {
        console.error("Error analyzing image:", error);
        setAiDescription("Erreur lors de l'analyse de l'image.");
        setIsAnalyzing(false);
    }
  };

  const getDeptStyle = (dept: string, selected: boolean) => {
    const base = "px-4 py-3 rounded-full border transition-all duration-300 text-sm font-bold flex items-center justify-center gap-2 shadow-lg";
    
    if (!selected) {
        return `${base} bg-[#0F172A] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200`;
    }

    switch(dept) {
        case 'MARKETING': return `${base} bg-[#0F172A] border-purple-500 text-purple-400 shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]`;
        case 'PRODUCT_AND_TECH': return `${base} bg-[#0F172A] border-cyan-500 text-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)]`;
        case 'OPERATIONS': return `${base} bg-[#0F172A] border-green-500 text-green-400 shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]`;
        case 'STAFF': return `${base} bg-[#0F172A] border-yellow-500 text-yellow-400 shadow-[0_0_15px_-3px_rgba(234,179,8,0.5)]`;
        case 'STRATEGIC_ACCOUNTS': return `${base} bg-[#0F172A] border-red-500 text-red-400 shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)]`;
        case 'FINANCE': return `${base} bg-[#0F172A] border-blue-500 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]`;
        default: return `${base} bg-[#0F172A] border-white text-white`;
    }
  };

  const ChevronLeftIcon = () => <ChevronLeft />;

  return (
    <div className="min-h-screen bg-fealty-light flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-100 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px]" />

      <div className="w-full max-w-3xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
           <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Configuration Profil</h2>
           <p className="text-slate-600 text-lg font-medium">Quelques étapes pour personnaliser votre Hub.</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-red-600' : 'w-3 bg-slate-300'}`} />
            ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col justify-between animate-slide-up relative overflow-hidden">
             
             {/* Step 1: Identity */}
             {step === 1 && (
                 <div className="space-y-8 animate-fade-in">
                     <div className="text-center">
                         <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-black mb-4">
                             <User size={32} />
                         </div>
                         <h3 className="text-2xl font-bold text-black">Qui êtes-vous ?</h3>
                     </div>
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              placeholder="Prénom"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-lg text-black placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 transition-all"
                              value={formData.firstName}
                              onChange={e => setFormData({...formData, firstName: e.target.value})}
                              autoFocus
                            />
                            <input 
                              type="text" 
                              placeholder="Nom"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-lg text-black placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 transition-all"
                              value={formData.lastName}
                              onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                         </div>
                     </div>
                     <Button 
                        className="w-full py-4 text-lg rounded-2xl mt-4" 
                        disabled={!formData.firstName || !formData.lastName}
                        onClick={() => setStep(2)}
                     >
                        Continuer <ArrowRight className="ml-2" />
                     </Button>
                 </div>
             )}

             {/* Step 2: Role */}
             {step === 2 && (
                 <div className="space-y-8 animate-fade-in">
                     <div className="text-center">
                         <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-black mb-4">
                             <Briefcase size={32} />
                         </div>
                         <h3 className="text-2xl font-bold text-black">Votre rôle ?</h3>
                     </div>
                     
                     <div className="space-y-4">
                         <input 
                           type="text" 
                           placeholder="Votre poste (ex: Product Manager)"
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-lg text-black placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 transition-all"
                           value={formData.role}
                           onChange={e => setFormData({...formData, role: e.target.value})}
                         />
                         
                         <div className="grid grid-cols-2 gap-3">
                             {DEPARTMENTS.map(dept => (
                                 <button
                                    key={dept}
                                    onClick={() => setFormData({...formData, department: dept})}
                                    className={getDeptStyle(dept, formData.department === dept)}
                                 >
                                    {dept.replace(/_/g, ' ')}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-black font-bold">
                            <ChevronLeftIcon />
                        </button>
                        <Button 
                            className="flex-1 py-4 text-lg rounded-2xl" 
                            disabled={!formData.role}
                            onClick={() => setStep(3)}
                        >
                            Suivant <ArrowRight className="ml-2" />
                        </Button>
                     </div>
                 </div>
             )}

             {/* Step 3: Photo (Uploaded or Avatar) */}
             {step === 3 && (
                 <div className="space-y-6 animate-fade-in h-full flex flex-col">
                     <div className="text-center">
                         <h3 className="text-2xl font-bold text-black">Photo de Profil</h3>
                         <p className="text-slate-500 text-sm">Choisissez un avatar ou uploadez votre photo.</p>
                     </div>

                     <div className="flex-1 flex flex-col md:flex-row gap-8 items-start justify-center min-h-0">
                         
                         {/* Option A: Avatars */}
                         <div className="flex-1 w-full flex flex-col gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider text-center md:text-left">Choisir un avatar</p>
                                <div className="grid grid-cols-5 gap-3">
                                    {AVATAR_SEEDS.map((seed, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => { setSelectedSeed(seed); setUploadedImage(null); }}
                                            className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedSeed === seed && !uploadedImage ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-100'}`}
                                        >
                                            <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=${avatarBg}`} alt={`Avatar ${seed}`} className="w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Color Picker */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Palette size={14} className="text-slate-400" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Couleur de fond</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {BG_COLORS.map(color => (
                                        <button 
                                            key={color}
                                            onClick={() => setAvatarBg(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${avatarBg === color ? 'border-slate-600 scale-110' : 'border-white shadow-sm'}`}
                                            style={{ backgroundColor: `#${color}` }}
                                        />
                                    ))}
                                </div>
                            </div>
                         </div>

                         <div className="hidden md:block w-px bg-slate-100 self-stretch mx-4"></div>
                         <div className="md:hidden w-full h-px bg-slate-100 my-4"></div>

                         {/* Option B: Upload & Preview */}
                         <div className="flex-1 w-full flex flex-col items-center">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Aperçu & Upload</p>
                             
                             <div 
                                className={`relative group cursor-pointer mb-6 ring-4 ring-offset-4 rounded-full transition-all ${uploadedImage ? 'ring-fealty-green' : 'ring-slate-100'}`}
                                onClick={() => fileInputRef.current?.click()}
                             >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                
                                <div className="w-40 h-40 rounded-full border-[4px] border-slate-100 shadow-xl overflow-hidden bg-slate-50 flex items-center justify-center relative transition-colors group-hover:border-slate-200">
                                    <img 
                                        src={currentAvatarUrl} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </div>
                             </div>

                             {/* AI Analysis Result */}
                             {uploadedImage && (
                                 <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-center relative overflow-hidden animate-slide-up">
                                     {isAnalyzing ? (
                                         <div className="flex items-center gap-3 text-slate-500">
                                             <Loader2 className="animate-spin text-fealty-green" size={16} />
                                             <span className="text-xs font-medium">Analyse IA...</span>
                                         </div>
                                     ) : aiDescription ? (
                                         <div className="text-left w-full relative z-10">
                                             <div className="flex items-center gap-2 mb-2 text-conisia-purple font-bold text-[10px] uppercase tracking-wider">
                                                 <Sparkles size={12} /> Description IA
                                             </div>
                                             <p className="text-xs text-slate-700 leading-relaxed">{aiDescription}</p>
                                         </div>
                                     ) : null}
                                 </div>
                             )}
                         </div>
                     </div>

                     <div className="flex gap-4 pt-4 border-t border-slate-100 mt-auto">
                        <button onClick={() => setStep(2)} className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-black font-bold">
                            <ChevronLeftIcon />
                        </button>
                        <Button 
                            className="flex-1 py-4 text-lg font-bold rounded-2xl" 
                            onClick={handleSubmit}
                        >
                            Terminer <Check className="ml-2" />
                        </Button>
                     </div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};