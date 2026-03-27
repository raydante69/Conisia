import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { FileText, Folder, MoreVertical, Plus, Trash2, Eye, Share2, Grid, List, X, Check, Search, Download, Tag, History, Users, Shield, Pin, PinOff, FileSpreadsheet, FileIcon, Image as ImageIcon, Sparkles, Loader2, Filter, Calendar, User, Clock, CheckSquare, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { AppDocument, Department, DEPARTMENTS } from '../types';
import { analyzeImageContent } from '../services/geminiService';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, deleteDocument, currentUser, addTagToDocument, removeTagFromDocument, shareDocument, togglePinDocument, updateDocumentDescription } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Search & Filters
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | 'ALL'>('ALL');
  
  // Bulk Selection
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  // Modals
  const [previewDoc, setPreviewDoc] = useState<AppDocument | null>(null);
  const [historyDoc, setHistoryDoc] = useState<AppDocument | null>(null);
  const [shareDoc, setShareDoc] = useState<AppDocument | null>(null);
  const [newTag, setNewTag] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const getFileIcon = (type: string, size: number = 20) => {
      const t = type.toLowerCase();
      if (t === 'pdf') return <FileText size={size} className="text-red-500" />;
      if (t === 'xlsx' || t === 'csv' || t === 'xls') return <FileSpreadsheet size={size} className="text-green-600" />;
      if (t === 'docx' || t === 'doc') return <FileText size={size} className="text-blue-600" />;
      if (t === 'jpg' || t === 'png' || t === 'jpeg' || t === 'webp') return <ImageIcon size={size} className="text-purple-500" />;
      return <FileIcon size={size} className="text-slate-400" />;
  };

  const isImage = (type: string) => ['jpg', 'png', 'jpeg', 'webp', 'gif'].includes(type.toLowerCase());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      addDocument({
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploader: currentUser?.name || 'Moi',
        department: currentUser?.department || 'STAFF',
        url: objectUrl
      });
    }
  };

  const handleAnalyzeAI = async () => {
      if (!previewDoc || !previewDoc.url) return;
      setAnalyzing(true);
      try {
          const response = await fetch(previewDoc.url);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
              const base64data = reader.result as string;
              const base64Content = base64data.split(',')[1];
              const mimeType = blob.type;
              
              const result = await analyzeImageContent(base64Content, mimeType);
              updateDocumentDescription(previewDoc.id, result);
              setAnalyzing(false);
          }
      } catch (e) {
          console.error("Error analyzing", e);
          setAnalyzing(false);
      }
  };

  // Bulk Logic
  const toggleDocSelection = (id: string) => {
      const newSet = new Set(selectedDocs);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedDocs(newSet);
  };

  const toggleSelectAll = () => {
      if (selectedDocs.size === displayDocs.length) {
          setSelectedDocs(new Set());
      } else {
          setSelectedDocs(new Set(displayDocs.map(d => d.id)));
      }
  };

  const deleteSelected = () => {
      selectedDocs.forEach(id => deleteDocument(id));
      setSelectedDocs(new Set());
      setIsBulkMode(false);
  };

  // Filter Logic
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(filter.toLowerCase()) || doc.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
    const matchesFolder = selectedFolder === 'ALL' || doc.department === selectedFolder;
    const matchesType = filterType === 'ALL' || doc.type.toUpperCase() === filterType;
    const matchesAuthor = !filterAuthor || doc.uploader.toLowerCase().includes(filterAuthor.toLowerCase());
    const matchesDate = !filterDate || doc.date === filterDate;

    return matchesSearch && matchesFolder && matchesType && matchesAuthor && matchesDate;
  });

  const pinnedDocs = filteredDocs.filter(d => d.isPinned);
  const otherDocs = filteredDocs.filter(d => !d.isPinned);
  const displayDocs = [...pinnedDocs, ...otherDocs];

  return (
    <div className="h-full flex flex-col animate-fade-in font-sans relative">
      {/* Bulk Action Bar - Sticky Top Overlay */}
      {isBulkMode && selectedDocs.size > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-fealty-dark text-white p-4 rounded-xl flex justify-between items-center shadow-2xl animate-slide-up mx-2">
              <span className="font-bold ml-2">{selectedDocs.size} fichier(s) sélectionné(s)</span>
              <div className="flex gap-2">
                  <button onClick={() => setSelectedDocs(new Set())} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Annuler</button>
                  <Button variant="white" className="py-2 h-auto text-sm gap-2" onClick={() => {/* Share Logic Placeholder */ alert('Partage en masse simulé !'); }}>
                      <Share2 size={16} /> Partager
                  </Button>
                  <Button variant="primary" className="py-2 h-auto text-sm gap-2 bg-red-600 hover:bg-red-700 border-none shadow-none" onClick={deleteSelected}>
                      <Trash2 size={16} /> Supprimer
                  </Button>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-fealty-dark">Documents</h2>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
             <span>Accueil</span> <span>/</span> <span className="text-fealty-dark font-medium">Fichiers</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <Button 
            onClick={() => { setIsBulkMode(!isBulkMode); setSelectedDocs(new Set()); }} 
            variant="outline" 
            className={`border-slate-200 ${isBulkMode ? 'bg-slate-900 text-white border-slate-900' : ''}`}
          >
             {isBulkMode ? 'Terminer Sélection' : 'Sélection Multiple'}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} className="bg-fealty-green text-fealty-dark hover:bg-green-400">
            <Plus size={18} /> Uploader
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col gap-2">
         <div className="flex flex-col sm:flex-row justify-between gap-4 items-center p-2">
            <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
                {['ALL', ...DEPARTMENTS].map(dept => (
                    <button
                    key={dept}
                    onClick={() => setSelectedFolder(dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedFolder === dept ? 'bg-fealty-dark text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                    {dept === 'ALL' ? 'Tous' : dept.split('_')[0]}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex-1">
                    <Search size={16} className="text-slate-400 ml-1" />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full sm:w-32"
                    />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-fealty-mint border-fealty-green text-fealty-dark' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                >
                    <Filter size={18} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><List size={18} /></button>
            </div>
         </div>

         {/* Advanced Filters Panel */}
         {showFilters && (
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-t border-slate-100 animate-slide-up">
                 <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
                     <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 text-sm text-slate-700 outline-none focus:border-fealty-green"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                     >
                         <option value="ALL">Tous les types</option>
                         <option value="PDF">PDF</option>
                         <option value="DOCX">Document Word</option>
                         <option value="XLSX">Excel</option>
                         <option value="IMG">Images</option>
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                     <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 pl-9 text-sm text-slate-700 outline-none focus:border-fealty-green"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                     </div>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase">Auteur</label>
                     <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Nom..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 pl-9 text-sm text-slate-700 outline-none focus:border-fealty-green"
                            value={filterAuthor}
                            onChange={(e) => setFilterAuthor(e.target.value)}
                        />
                     </div>
                 </div>
             </div>
         )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
         {displayDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <Folder size={64} className="mb-4 text-slate-200" />
               <p>Aucun document trouvé</p>
               {showFilters && <p className="text-xs mt-2 text-slate-400">Essayez de modifier vos filtres.</p>}
            </div>
         ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {displayDocs.map(doc => (
                  <div 
                    key={doc.id} 
                    className={`group relative bg-white rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-64 ${doc.isPinned ? 'border-fealty-green shadow-lg shadow-green-100' : 'border-slate-100 hover:border-slate-300 hover:shadow-xl'}`}
                    onClick={() => {
                        if (isBulkMode) toggleDocSelection(doc.id);
                        else setPreviewDoc(doc);
                    }}
                  >
                     {/* Preview Area / Icon Area */}
                     <div className="h-32 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                        {isImage(doc.type) && doc.url ? (
                            <img src={doc.url} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="transform group-hover:scale-110 transition-transform duration-300 opacity-50 grayscale group-hover:grayscale-0">
                                {getFileIcon(doc.type, 48)}
                            </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                             {!isBulkMode && (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); setHistoryDoc(doc); }} className="p-1.5 bg-white/90 rounded-full hover:text-blue-500 shadow-sm" title="Historique">
                                        <Clock size={14} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); togglePinDocument(doc.id); }} className="p-1.5 bg-white/90 rounded-full hover:text-fealty-green shadow-sm">
                                        {doc.isPinned ? <PinOff size={14} className="text-fealty-green" /> : <Pin size={14} />}
                                    </button>
                                </>
                             )}
                        </div>

                         {/* Bulk Selection Overlay */}
                         {isBulkMode && (
                             <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity ${selectedDocs.has(doc.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform transition-transform ${selectedDocs.has(doc.id) ? 'bg-fealty-green scale-110' : 'bg-white scale-100'}`}>
                                     <Check size={16} className={selectedDocs.has(doc.id) ? 'text-white' : 'text-slate-300'} />
                                 </div>
                             </div>
                         )}
                     </div>

                     <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                             <div className="p-2 bg-slate-50 rounded-xl">{getFileIcon(doc.type, 18)}</div>
                             {isBulkMode && (
                                 <div 
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${selectedDocs.has(doc.id) ? 'bg-fealty-dark border-fealty-dark' : 'border-slate-300'}`}
                                 >
                                    {selectedDocs.has(doc.id) && <Check size={12} className="text-white" />}
                                 </div>
                             )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm truncate mb-1" title={doc.name}>{doc.name}</h3>
                        <div className="flex justify-between mt-auto items-end">
                            <span className="text-[10px] text-slate-400">{doc.date}</span>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{doc.size}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                       <tr>
                           {isBulkMode && (
                               <th className="p-5 w-10">
                                   <div 
                                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${selectedDocs.size === displayDocs.length && displayDocs.length > 0 ? 'bg-fealty-dark border-fealty-dark' : 'border-slate-300'}`}
                                      onClick={toggleSelectAll}
                                   >
                                       {selectedDocs.size === displayDocs.length && displayDocs.length > 0 && <Check size={12} className="text-white" />}
                                   </div>
                               </th>
                           )}
                           <th className="p-5">Nom du fichier</th>
                           <th className="p-5 hidden sm:table-cell">Tags</th>
                           <th className="p-5 hidden md:table-cell">Propriétaire</th>
                           <th className="p-5">Taille</th>
                           <th className="p-5 text-right">Action</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                       {displayDocs.map(doc => (
                           <tr 
                                key={doc.id} 
                                onClick={() => {
                                    if (isBulkMode) toggleDocSelection(doc.id);
                                    else setPreviewDoc(doc);
                                }}
                                className={`hover:bg-fealty-mint/30 cursor-pointer transition-colors group ${selectedDocs.has(doc.id) ? 'bg-fealty-mint/20' : ''}`}
                            >
                               {isBulkMode && (
                                   <td className="p-5" onClick={e => e.stopPropagation()}>
                                       <div 
                                            className={`w-5 h-5 rounded border flex items-center justify-center ${selectedDocs.has(doc.id) ? 'bg-fealty-dark border-fealty-dark' : 'border-slate-300'}`}
                                            onClick={() => toggleDocSelection(doc.id)}
                                        >
                                            {selectedDocs.has(doc.id) && <Check size={12} className="text-white" />}
                                        </div>
                                   </td>
                               )}
                               <td className="p-5 flex items-center gap-4">
                                   <div className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm">{getFileIcon(doc.type)}</div>
                                   <div>
                                       <p className="font-bold text-slate-800">{doc.name}</p>
                                       {doc.isPinned && <span className="text-[10px] text-fealty-green flex items-center gap-1"><Pin size={8} /> Épinglé</span>}
                                   </div>
                               </td>
                               <td className="p-5 hidden sm:table-cell">
                                   <div className="flex gap-1">
                                       {doc.tags.slice(0, 2).map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500">#{t}</span>)}
                                   </div>
                               </td>
                               <td className="p-5 hidden md:table-cell text-slate-500">{doc.uploader}</td>
                               <td className="p-5 text-slate-500 font-mono text-xs">{doc.size}</td>
                               <td className="p-5 text-right">
                                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       {!isBulkMode && (
                                           <>
                                            <button onClick={(e) => { e.stopPropagation(); setHistoryDoc(doc); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Historique"><Clock size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setShareDoc(doc); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Share2 size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                           </>
                                       )}
                                   </div>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
            </div>
         )}
      </div>

      {/* COMPACT PREVIEW MODAL */}
      {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => setPreviewDoc(null)}>
              <div className="bg-white w-full max-w-4xl h-[70vh] rounded-[2rem] overflow-hidden flex shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  
                  {/* Left: Preview */}
                  <div className="flex-1 bg-slate-100 flex items-center justify-center relative">
                      {isImage(previewDoc.type) && previewDoc.url ? (
                          <img src={previewDoc.url} className="max-w-full max-h-full object-contain" />
                      ) : (
                          <div className="text-center opacity-30">
                              {getFileIcon(previewDoc.type, 80)}
                              <p className="mt-4 font-bold text-slate-500">Aperçu non disponible</p>
                          </div>
                      )}
                      
                      {/* Floating Actions on Preview */}
                      <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => window.open(previewDoc.url || '#', '_blank')} className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                              <Download size={18} />
                          </button>
                      </div>
                  </div>

                  {/* Right: Info Panel (Compact) */}
                  <div className="w-80 bg-white flex flex-col border-l border-slate-100">
                      <div className="p-6 border-b border-slate-50">
                          <div className="flex justify-between items-start mb-2">
                              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">{getFileIcon(previewDoc.type, 24)}</div>
                              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-800"><X size={20} /></button>
                          </div>
                          <h3 className="font-bold text-lg leading-tight mb-1">{previewDoc.name}</h3>
                          <p className="text-xs text-slate-400">{previewDoc.size} • {previewDoc.date}</p>
                      </div>

                      <div className="p-6 flex-1 overflow-y-auto space-y-6">
                          
                          {/* AI Analysis Section */}
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
                              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
                                  <Sparkles size={14} /> Analyse IA
                              </div>
                              {previewDoc.aiDescription ? (
                                  <p className="text-xs text-slate-600 leading-relaxed">{previewDoc.aiDescription}</p>
                              ) : (
                                  <div className="text-center">
                                      <p className="text-[10px] text-slate-400 mb-2">Analysez ce fichier pour obtenir un résumé et des mots-clés.</p>
                                      <Button 
                                        onClick={handleAnalyzeAI} 
                                        disabled={analyzing}
                                        className="w-full py-2 text-xs h-auto bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-md"
                                      >
                                          {analyzing ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Lancer l\'analyse'}
                                      </Button>
                                  </div>
                              )}
                          </div>

                          {/* Tags */}
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Tags</p>
                              <div className="flex flex-wrap gap-2">
                                  {previewDoc.tags.map(t => (
                                      <span key={t} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-1">
                                          #{t} <button onClick={() => removeTagFromDocument(previewDoc.id, t)} className="hover:text-red-500"><X size={10} /></button>
                                      </span>
                                  ))}
                                  <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1 w-full mt-1 border border-slate-200 focus-within:border-fealty-green">
                                      <Plus size={12} className="text-slate-400" />
                                      <input 
                                        className="bg-transparent border-none outline-none text-xs w-full"
                                        placeholder="Ajouter un tag..."
                                        value={newTag}
                                        onChange={e => setNewTag(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && {}}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="p-4 border-t border-slate-100 flex gap-2">
                          <Button className="flex-1 bg-fealty-dark text-white py-3 h-auto rounded-xl text-sm" onClick={() => setShareDoc(previewDoc)}>
                              Partager
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* HISTORY MODAL */}
      {historyDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => setHistoryDoc(null)}>
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setHistoryDoc(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
                      <X size={20} />
                  </button>
                  
                  <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Historique des versions</h3>
                      <p className="text-slate-500 text-sm">{historyDoc.name}</p>
                  </div>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {historyDoc.versions.map((v, i) => (
                          <div key={i} className="flex gap-4 group">
                              <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-fealty-green text-fealty-dark' : 'bg-slate-100 text-slate-500'}`}>
                                      v{v.version}
                                  </div>
                                  {i < historyDoc.versions.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                              </div>
                              <div className="flex-1 pb-6">
                                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-2">
                                          <span className="text-sm font-bold text-slate-800">{v.author}</span>
                                          <span className="text-xs text-slate-400">{v.date}</span>
                                      </div>
                                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg">{v.changes}</p>
                                      <div className="mt-3 flex gap-2">
                                          <button className="text-xs font-bold text-fealty-dark hover:underline">Restaurer</button>
                                          <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Télécharger</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};