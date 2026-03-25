import React from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Layers, Users, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const StatsView: React.FC = () => {
    const { documents, requests } = useData();

    // Calculate stats
    const totalDocs = documents.length;
    const totalRequests = requests.length;
    const completedRequests = requests.filter(r => r.status === 'DONE').length;
    const pendingRequests = requests.filter(r => r.status !== 'DONE').length;
    const activeUsers = 48; // Mock value as we don't have full user base

    // Department Stats for Chart
    const deptStats = documents.reduce((acc, doc) => {
        const dept = doc.department as string;
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div>
                <h2 className="text-3xl font-bold text-fealty-dark">Statistiques</h2>
                <p className="text-slate-500 mt-1">Vue d'ensemble de l'activité sur le Hub.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Documents</p>
                        <p className="text-3xl font-bold text-slate-800">{totalDocs}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Layers size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Demandes Traitées</p>
                        <p className="text-3xl font-bold text-slate-800">{completedRequests}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">En cours</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Demandes Actives</p>
                        <p className="text-3xl font-bold text-slate-800">{pendingRequests}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+3 nvx</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Utilisateurs Actifs</p>
                        <p className="text-3xl font-bold text-slate-800">{activeUsers}</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Representation of Request Status */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                         <TrendingUp size={20} className="text-fealty-green" /> Performance Demandes
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm font-medium text-slate-600">
                                 <span>Taux de complétion</span>
                                 <span>{Math.round((completedRequests / (totalRequests || 1)) * 100)}%</span>
                             </div>
                             <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-gradient-to-r from-fealty-green to-emerald-500 rounded-full" style={{ width: `${(completedRequests / (totalRequests || 1)) * 100}%` }} />
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="block text-xs font-bold text-slate-400 uppercase">À Faire</span>
                                <span className="text-2xl font-bold text-slate-800">{requests.filter(r => r.status === 'TODO').length}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="block text-xs font-bold text-slate-400 uppercase">En Cours</span>
                                <span className="text-2xl font-bold text-slate-800">{requests.filter(r => r.status === 'IN_PROGRESS').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Docs by Department Bar Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-xl text-slate-800 mb-6">Documents par Pôle</h3>
                    <div className="space-y-4">
                        {Object.entries(deptStats).map(([dept, count]) => {
                            const percentage = (Number(count) / totalDocs) * 100;
                            return (
                                <div key={dept} className="group">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 group-hover:text-fealty-dark transition-colors">
                                        <span>{dept.replace(/_/g, ' ')}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-fealty-dark rounded-full group-hover:bg-fealty-green transition-colors duration-300" 
                                            style={{ width: `${percentage}%` }} 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(deptStats).length === 0 && (
                            <p className="text-slate-400 text-sm text-center py-8">Aucun document pour le moment</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};