import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ServiceRequest, RequestStatus, DEPARTMENTS, Department, RequestStep } from '../types';
import { Button } from './Button';
import { MoreHorizontal, Sparkles, Filter, Layers, AlertCircle, LayoutList, ArrowRight, CheckSquare, Activity, X, Calendar, User, Clock, AlertTriangle, Search, ChevronDown } from 'lucide-react';

export const MyTasksView: React.FC = () => {
  const { requests, updateRequestPriority, updateRequestDepartment, updateRequestStatus, toggleRequestStep, currentUser, users } = useData();
  const [groupBy, setGroupBy] = useState<'PRIORITY' | 'DEPARTMENT' | 'STATUS'>('PRIORITY');
  const [selectedTask, setSelectedTask] = useState<ServiceRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter for tasks assigned to 'me'
  const myTasks = requests.filter(r => r.assignedTo === currentUser?.id);

  // Apply search filter
  const filteredTasks = myTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedTaskId) {
        if (groupBy === 'PRIORITY') {
            updateRequestPriority(draggedTaskId, targetId as ServiceRequest['priority']);
        } else if (groupBy === 'DEPARTMENT') {
            updateRequestDepartment(draggedTaskId, targetId as Department);
        } else if (groupBy === 'STATUS') {
            updateRequestStatus(draggedTaskId, targetId as RequestStatus);
        }
      setDraggedTaskId(null);
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'HIGH') return 'bg-red-50 text-red-600 border border-red-100';
    if (p === 'MEDIUM') return 'bg-orange-50 text-orange-600 border border-orange-100';
    return 'bg-green-50 text-green-600 border border-green-100';
  };

  const priorities: { id: ServiceRequest['priority'], label: string }[] = [
      { id: 'HIGH', label: 'Haute Priorité' },
      { id: 'MEDIUM', label: 'Priorité Moyenne' },
      { id: 'LOW', label: 'Basse Priorité' }
  ];

  const statuses: { id: RequestStatus, label: string }[] = [
      { id: 'TODO', label: 'À Faire' },
      { id: 'IN_PROGRESS', label: 'En Cours' },
      { id: 'DONE', label: 'Terminé' }
  ];

  const columns = groupBy === 'PRIORITY' 
      ? priorities
      : (groupBy === 'DEPARTMENT' 
          ? DEPARTMENTS.map(d => ({ id: d, label: d.replace(/_/g, ' ') })) 
          : statuses
        );

  return (
    <div className="h-full flex flex-col animate-fade-in relative font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Mes Tâches</h2>
          <p className="text-slate-500 text-sm mt-1">Gérez les {filteredTasks.length} tâches qui vous sont assignées.</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
             {/* Task Search Bar */}
            <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-fealty-dark transition-colors" size={16} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une tâche..." 
                    className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-fealty-dark/10 w-full text-sm font-medium transition-all outline-none"
                />
            </div>

            {/* View Toggle */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm overflow-x-auto">
                <button 
                    onClick={() => setGroupBy('PRIORITY')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${groupBy === 'PRIORITY' ? 'bg-fealty-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <AlertCircle size={14} /> Priorité
                </button>
                <button 
                    onClick={() => setGroupBy('DEPARTMENT')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${groupBy === 'DEPARTMENT' ? 'bg-fealty-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Layers size={14} /> Pôle
                </button>
                <button 
                    onClick={() => setGroupBy('STATUS')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${groupBy === 'STATUS' ? 'bg-fealty-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Activity size={14} /> Workflow
                </button>
            </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {columns.map(col => {
             const colTasks = filteredTasks.filter(r => {
                 if (groupBy === 'PRIORITY') return r.priority === col.id;
                 if (groupBy === 'DEPARTMENT') return r.department === col.id;
                 return r.status === col.id;
             });
             
             return (
                <div 
                  key={col.id}
                  className="w-80 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <div className={`p-5 flex items-center justify-between sticky top-0 rounded-t-3xl z-10 border-b border-slate-100 ${groupBy === 'PRIORITY' && col.id === 'HIGH' ? 'bg-red-50/50' : 'bg-slate-50/50'}`}>
                    <h3 className={`font-bold text-sm uppercase tracking-wider truncate mr-2 ${groupBy === 'PRIORITY' && col.id === 'HIGH' ? 'text-red-600' : 'text-slate-700'}`} title={col.label}>
                        {col.label}
                    </h3>
                    <span className="bg-white text-slate-600 px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm min-w-[24px] text-center">
                      {colTasks.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {colTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-fealty-dark hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all group relative ${draggedTaskId === task.id ? 'opacity-50 scale-95' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : (task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}`}>
                             {task.status === 'DONE' ? 'Terminé' : (task.status === 'IN_PROGRESS' ? 'En cours' : 'À faire')}
                           </span>
                           <button className="text-slate-300 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full transition-colors"><MoreHorizontal size={16} /></button>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-sm mb-2 leading-snug">{task.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-slate-400">De:</span>
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {task.createdBy === 'me' ? 'Moi' : (users.find(u => u.id === task.createdBy)?.name || 'Inconnu')}
                              </span>
                           </div>
                           
                           {/* Quick Action Button - Only show if not already Done */}
                           {task.status !== 'DONE' && groupBy !== 'STATUS' && (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); updateRequestStatus(task.id, 'DONE'); }}
                                 className="p-1.5 rounded-lg bg-fealty-mint text-fealty-green hover:bg-fealty-green hover:text-white transition-colors"
                                 title="Marquer comme terminé"
                               >
                                   <CheckSquare size={14} />
                               </button>
                           )}
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                        <div className="h-full flex items-center justify-center rounded-2xl p-4 text-center opacity-40">
                            <div className="flex flex-col items-center">
                                <CheckSquare size={24} className="mb-2" />
                                <p className="text-xs font-medium">Aucune tâche</p>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
             )
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTask(null)} />
             <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
                 
                 {/* Header */}
                 <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                     <div>
                         <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedTask.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {selectedTask.status === 'DONE' ? 'Terminé' : (selectedTask.status === 'IN_PROGRESS' ? 'En Cours' : 'À Faire')}
                            </span>
                            {/* Priority Dropdown in Modal */}
                            <div className="relative inline-block group">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border cursor-pointer ${getPriorityColor(selectedTask.priority)}`}>
                                    {selectedTask.priority === 'HIGH' ? 'Priorité Haute' : (selectedTask.priority === 'MEDIUM' ? 'Priorité Moyenne' : 'Priorité Basse')}
                                    <ChevronDown size={12} />
                                </span>
                                {/* Hover Dropdown */}
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block z-20">
                                    {priorities.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => updateRequestPriority(selectedTask.id, p.id)}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 ${selectedTask.priority === p.id ? 'text-fealty-dark bg-slate-50' : 'text-slate-500'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${p.id === 'HIGH' ? 'bg-red-500' : p.id === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                         </div>
                         <h3 className="text-2xl font-bold text-slate-900 leading-tight">{selectedTask.title}</h3>
                     </div>
                     <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><X size={20} /></button>
                 </div>

                 {/* Body */}
                 <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                     <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm"><User size={16} /></div>
                             <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">Demandeur</p>
                                 <p className="text-sm font-bold text-slate-800">
                                     {selectedTask.createdBy === 'me' ? 'Moi' : (users.find(u => u.id === selectedTask.createdBy)?.name || 'Inconnu')}
                                 </p>
                             </div>
                         </div>
                         <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm"><Calendar size={16} /></div>
                             <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                                 <p className="text-sm font-bold text-slate-800">{selectedTask.createdAt}</p>
                             </div>
                         </div>
                     </div>

                     <div className="mb-8">
                         <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Description</h4>
                         <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                             {selectedTask.description}
                         </p>
                     </div>

                     <div className="mb-4">
                         <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Sparkles size={16} className="text-conisia-purple" /> Étapes de la tâche
                         </h4>
                         
                         {selectedTask.steps && selectedTask.steps.length > 0 ? (
                             <div className="space-y-3">
                                 {selectedTask.steps.map((step, idx) => (
                                     <div key={step.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors bg-white">
                                         <div className="mt-0.5">
                                             <input 
                                                type="checkbox" 
                                                checked={step.completed} 
                                                onChange={() => toggleRequestStep(selectedTask.id, step.id)}
                                                className="w-5 h-5 rounded border-slate-300 text-fealty-green focus:ring-fealty-green cursor-pointer" 
                                            />
                                         </div>
                                         <div className="flex-1">
                                             <p className={`text-sm ${step.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{step.text}</p>
                                         </div>
                                         <span className="text-xs font-mono text-slate-300">#{idx + 1}</span>
                                     </div>
                                 ))}
                             </div>
                         ) : (
                             <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                 <p className="text-slate-400 text-sm italic">Aucune sous-étape définie pour cette tâche.</p>
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                     <Button variant="outline" onClick={() => setSelectedTask(null)} className="border-slate-300 text-slate-600 hover:bg-white">Fermer</Button>
                     {selectedTask.status !== 'DONE' && (
                         <Button onClick={() => { updateRequestStatus(selectedTask.id, 'DONE'); setSelectedTask(null); }} className="bg-fealty-green text-fealty-dark hover:bg-green-400 font-bold shadow-lg shadow-green-200">
                             Marquer comme terminé
                         </Button>
                     )}
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};