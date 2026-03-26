import React, { useState, useRef, useMemo } from 'react';
import { Button } from './Button';
import { X, Upload, Image as ImageIcon, Palette } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useData();
  
  // Initialize state from currentUser
  const initialUploadedImage = currentUser?.avatar && !currentUser.avatar.includes('api.dicebear.com') ? currentUser.avatar : null;
  
  let initialSeed = 'Alex';
  let initialBg = 'e5e7eb';
  
  if (currentUser?.avatar && currentUser.avatar.includes('api.dicebear.com')) {
    try {
      const url = new URL(currentUser.avatar);
      initialSeed = url.searchParams.get('seed') || 'Alex';
      initialBg = url.searchParams.get('backgroundColor') || 'e5e7eb';
    } catch (e) {
      // Ignore invalid URL
    }
  }

  // Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialUploadedImage);
  
  // Avatar Builder State
  const [selectedSeed, setSelectedSeed] = useState<string>(initialSeed);
  const [avatarBg, setAvatarBg] = useState<string>(initialBg);
  
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
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
            setUploadedImage(dataUrl);
        };
    };
  };

  const handleSave = () => {
    if (currentUser) {
      updateProfile({
        avatar: currentAvatarUrl
      });
    }
    onClose();
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Modifier la photo de profil</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Preview Column */}
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                    <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 relative group">
                        <img src={currentAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="w-full">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 px-4 bg-white border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={18} />
                            Uploader une photo
                        </button>
                    </div>
                </div>

                {/* Customizer Column */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ImageIcon size={16} className="text-slate-400" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choisir un avatar</p>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {AVATAR_SEEDS.map(seed => (
                                <button
                                    key={seed}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSeed(seed);
                                        setUploadedImage(null); // Clear upload if selecting avatar
                                    }}
                                    className={`aspect-square rounded-xl border-2 overflow-hidden transition-all hover:scale-105 ${selectedSeed === seed && !uploadedImage ? 'border-slate-800 shadow-md scale-105' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                    <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=${avatarBg}`} alt={`Avatar ${seed}`} className="w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Palette size={16} className="text-slate-400" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Couleur de fond</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {BG_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setAvatarBg(color)}
                                    style={{ backgroundColor: `#${color}` }}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${avatarBg === color ? 'border-slate-600 scale-110' : 'border-white shadow-sm'}`}
                                    title={`#${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <Button variant="glass" onClick={onClose} className="text-slate-600">Annuler</Button>
          <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
};
