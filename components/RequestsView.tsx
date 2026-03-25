import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ServiceRequest, RequestStatus, DEPARTMENTS, Department, RequestStep } from '../types';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Plus, MoreHorizontal, Sparkles, X, Loader2, Filter, Layers, CheckCircle2, ChevronRight, LayoutList } from 'lucide-react';
import { analyzeRequestAndGenerateSteps } from '../services/geminiService';

export const RequestsView: React.FC = () => {
  const { requests, addRequest, updateRequestStatus, updateRequestDepartment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<'STATUS' | 'DEPARTMENT'>('STATUS');
  
  // Only show requests Created By Me (sent requests)
  const mySentRequests = requests.filter(r => r.createdBy === 'me');

  // Drag and Drop State
  const [draggedRequestId, setDraggedRequestId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedRequestId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image hack
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedRequestId) {
        if (groupBy === 'STATUS') {
            updateRequestStatus(draggedRequestId, targetId as RequestStatus);
        } else {
            updateRequestDepartment(draggedRequestId, targetId as Department);
        }
      setDraggedRequestId(null);
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'HIGH') return 'bg-red-50 text-red-600 border border-red-100';
    if (p === 'MEDIUM') return 'bg-orange-50 text-orange-600 border border-orange-100';
    return 'bg-green-50 text-green-600 border border-green-100';
  };

  const columns = groupBy === 'STATUS' 
      ? [
          { id: 'TODO', label: 'À Faire' },
          { id: 'IN_PROGRESS', label: 'En Cours' },
          { id: 'DONE', label: 'Terminé' }
        ]
      : DEPARTMENTS.map(d => ({ id: d, label: d.replace(/_/g, ' ') }));

  return (
    <div className="h-full flex flex-col animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Mes Demandes</h2>
          <p className="text-slate-500 text-sm mt-1">Suivez l'avancement des tickets que vous avez ouverts.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           {/* View Toggle */}
           <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
               <button 
                  onClick={() => setGroupBy('STATUS')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${groupBy === 'STATUS' ? 'bg-fealty-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <LayoutList size={14} /> Statut
               </button>
               <button 
                  onClick={() => setGroupBy('DEPARTMENT')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${groupBy === 'DEPARTMENT' ? 'bg-fealty-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <Layers size={14} /> Pôle
               </button>
           </div>
           
           <Button onClick={() => setIsModalOpen(true)} className="ml-auto bg-fealty-green text-fealty-dark hover:bg-green-400 font-bold shadow-lg shadow-green-200">
             <Plus size={18} /> Nouvelle Demande
           </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {columns.map(col => {
             const colRequests = mySentRequests.filter(r => groupBy === 'STATUS' ? r.status === col.id : r.department === col.id);
             
             return (
                <div 
                  key={col.id}
                  className="w-80 flex flex-col bg-slate-100/50 rounded-3xl border border-slate-200/50 backdrop-blur-sm transition-colors hover:bg-slate-100/80"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <div className="p-5 flex items-center justify-between sticky top-0 bg-transparent z-10">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider truncate mr-2" title={col.label}>{col.label}</h3>
                    <span className="bg-white text-slate-600 px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm min-w-[24px] text-center">
                      {colRequests.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto custom-scrollbar">
                    {colRequests.map(req => (
                      <div
                        key={req.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, req.id)}
                        className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-fealty-green hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all group relative ${draggedRequestId === req.id ? 'opacity-50 scale-95' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getPriorityColor(req.priority)}`}>
                             {req.priority}
                           </span>
                           <button className="text-slate-300 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full transition-colors"><MoreHorizontal size={16} /></button>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-sm mb-2 leading-snug">{req.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{req.description}</p>
                        
                        {/* Steps Progress */}
                        {req.steps && req.steps.length > 0 && (
                          <div className="mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                              <span className="flex items-center gap-1"><Sparkles size={10} className="text-conisia-purple"/> IA Steps</span>
                              <span>{req.steps.filter(s => s.completed).length}/{req.steps.length}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-gradient-to-r from-conisia-purple to-pink-500 rounded-full transition-all duration-500" 
                                 style={{width: `${(req.steps.filter(s => s.completed).length / req.steps.length) * 100}%`}} 
                               />
                            </div>
                          </div>
                        )}
    
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-fealty-dark text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                                 {req.assignedTo.charAt(0)}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">{req.assignedTo.split(' ')[0]}</span>
                           </div>
                           <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md font-mono">
                              {new Date(req.createdAt).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'})}
                           </span>
                        </div>
                      </div>
                    ))}
                    {colRequests.length === 0 && (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center">
                            <p className="text-xs text-slate-400 font-medium">Glisser une demande ici</p>
                        </div>
                    )}
                  </div>
                </div>
             )
          })}
        </div>
      </div>

      <CreateRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// --- Modern "Fealty" Style Create Request Modal ---

const CreateRequestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addRequest } = useData();
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState<{
    department: Department;
    person: string;
    title: string;
    description: string;
    steps: RequestStep[];
  }>({
    department: 'MARKETING',
    person: '',
    title: '',
    description: '',
    steps: []
  });

  const handleAIAnalysis = async () => {
    if (!formData.title || !formData.description) return;
    setLoadingAI(true);
    const stepsText = await analyzeRequestAndGenerateSteps(formData.title, formData.description, formData.department);
    const stepsObj: RequestStep[] = stepsText.map((t, i) => ({ id: `step-${i}`, text: t, completed: false }));
    setFormData(prev => ({ ...prev, steps: stepsObj }));
    setLoadingAI(false);
  };

  const handleSubmit = () => {
    addRequest({
      title: formData.title,
      description: formData.description,
      department: formData.department,
      assignedTo: formData.person || 'Unassigned',
      priority: 'MEDIUM',
      steps: formData.steps
    });
    onClose();
    setTimeout(() => {
        setStep(1);
        setFormData({ department: 'MARKETING', person: '', title: '', description: '', steps: [] });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
         
         {/* Minimalist Header */}
         <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white z-10">
           <div>
               <h3 className="text-2xl font-bold text-fealty-dark">Nouvelle Demande</h3>
               <p className="text-sm text-slate-400">Étape {step} sur 2</p>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"><X size={20} /></button>
         </div>

         {/* Content Area */}
         <div className="px-8 pb-8 flex-1 overflow-y-auto custom-scrollbar">
           
           {/* Step Indicator Line */}
           <div className="w-full h-1 bg-slate-100 rounded-full mb-8 overflow-hidden">
               <div className="h-full bg-fealty-green transition-all duration-500 ease-out" style={{width: step === 1 ? '50%' : '100%'}} />
           </div>

           {step === 1 ? (
             <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layers size={16} className="text-fealty-green" /> Pôle concerné
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {DEPARTMENTS.map(dept => (
                      <button
                        key={dept}
                        onClick={() => setFormData({...formData, department: dept})}
                        className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all duration-200 group flex items-center justify-between ${formData.department === dept ? 'border-fealty-dark bg-fealty-dark text-white shadow-lg shadow-slate-300' : 'border-slate-100 text-slate-500 hover:border-fealty-green hover:bg-fealty-mint'}`}
                      >
                        {dept.replace(/_/g, ' ')}
                        {formData.department === dept && <CheckCircle2 size={16} className="text-fealty-green" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Destinataire (Optionnel)</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Jean Dupont"
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-fealty-green outline-none font-medium text-slate-800 placeholder:text-slate-400 transition-all"
                     value={formData.person}
                     onChange={(e) => setFormData({...formData, person: e.target.value})}
                   />
                </div>

                <div className="pt-4">
                    <Button className="w-full py-4 text-base bg-fealty-dark text-white hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200" onClick={() => setStep(2)}>
                        Suivant <ChevronRight size={18} />
                    </Button>
                </div>
             </div>
           ) : (
             <div className="space-y-6 animate-fade-in">
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Titre de la demande</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Création logo produit"
                     autoFocus
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-fealty-green outline-none font-bold text-lg text-slate-800 placeholder:text-slate-400 transition-all"
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Description détaillée</label>
                   <textarea 
                     rows={5}
                     placeholder="Décrivez votre besoin le plus précisément possible..."
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-fealty-green outline-none resize-none text-slate-600 leading-relaxed"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                {/* AI Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-[2rem] border border-indigo-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                   
                   <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-conisia-purple shadow-sm"><Sparkles size={16} /></div>
                         Assistant IA
                      </div>
                      <button 
                        onClick={handleAIAnalysis}
                        disabled={loadingAI || !formData.title}
                        className="text-xs font-bold px-4 py-2 bg-conisia-purple text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-105 transition-all disabled:opacity-50 disabled:shadow-none"
                      >
                         {loadingAI ? 'Analyse...' : 'Générer le plan d\'action'}
                      </button>
                   </div>
                   
                   <div className="relative z-10 min-h-[60px]">
                       {loadingAI ? (
                         <div className="flex items-center justify-center py-4 text-slate-400 gap-2 text-sm">
                            <Loader2 className="animate-spin" size={16} /> L'IA structure votre demande...
                         </div>
                       ) : formData.steps.length > 0 ? (
                          <ul className="space-y-2">
                             {formData.steps.map((s, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white/60 p-3 rounded-xl border border-white/50 backdrop-blur-sm shadow-sm animate-fade-in" style={{animationDelay: `${i*100}ms`}}>
                                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full mt-0.5">{i+1}</span>
                                  <span className="leading-snug">{s.text}</span>
                               </li>
                             ))}
                          </ul>
                       ) : (
                         <p className="text-xs text-slate-500 italic leading-relaxed text-center px-4">
                            Cliquez sur "Générer" pour que l'IA analyse votre demande et propose automatiquement les étapes techniques nécessaires au pôle {formData.department.replace(/_/g, ' ')}.
                         </p>
                       )}
                   </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl border-slate-200">Retour</Button>
                  <Button onClick={handleSubmit} className="flex-1 py-4 rounded-2xl bg-fealty-green text-fealty-dark hover:bg-green-400 font-bold shadow-lg shadow-green-200" disabled={!formData.title}>
                      Créer la demande
                  </Button>
                </div>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};