import React from 'react';
import { Features } from './Features';
import { IntelligentSearch } from './IntelligentSearch';
import { CollaborativeGroups } from './CollaborativeGroups';
import { Button } from './Button';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { LandingView } from '../types';

interface PageProps {
    onNavigate: (view: LandingView) => void;
}

export const FeaturesPage: React.FC<PageProps> = ({ onNavigate }) => {
    return (
        <div className="pt-32 pb-20 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <button onClick={() => onNavigate('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-conisia-purple mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </button>
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">Toutes les fonctionnalités</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">Explorez en détail comment Conisia transforme la gestion de vos connaissances.</p>
                </div>
            </div>
            <Features />
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold mb-6">Pourquoi choisir Conisia ?</h3>
                        <ul className="space-y-4">
                            {[
                                "Centralisation complète des ressources",
                                "Recherche sémantique ultra-rapide",
                                "Gestion des droits fine par département",
                                "Accessible sur mobile et tablette"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check size={14} /></div>
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-100 rounded-3xl p-8 h-80 flex items-center justify-center">
                        <p className="text-slate-400 font-bold">Illustration Détaillée</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AiPage: React.FC<PageProps> = ({ onNavigate }) => {
    return (
        <div className="pt-32 pb-20 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 mb-10">
                <button onClick={() => onNavigate('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-conisia-purple mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </button>
            </div>
            <IntelligentSearch />
            <div className="bg-slate-900 text-white py-20 mt-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-6">Propulsé par Gemini Pro</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Notre intelligence artificielle ne se contente pas de chercher des mots-clés. Elle comprend le contexte de votre entreprise, analyse vos documents PDF, Word et Excel pour vous fournir des réponses précises et synthétisées.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const GroupsPage: React.FC<PageProps> = ({ onNavigate }) => {
    return (
        <div className="pt-32 pb-20 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 mb-10">
                <button onClick={() => onNavigate('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-conisia-purple mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </button>
            </div>
            <CollaborativeGroups />
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-conisia-purple to-indigo-600 rounded-[3rem] p-12 text-white text-center mt-12">
                    <h2 className="text-3xl font-bold mb-4">Prêt à collaborer ?</h2>
                    <p className="opacity-90 mb-8">Créez votre premier groupe de projet dès maintenant.</p>
                    <Button variant="glass" onClick={() => {}}>Demander un accès groupe</Button>
                </div>
            </div>
        </div>
    );
};