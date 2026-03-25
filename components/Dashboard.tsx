import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  Bot, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  File,
  Layers,
  ArrowRight,
  Check,
  CheckSquare,
  BarChart2,
  FolderPlus,
  Plus,
  X
} from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { GlassCard } from './GlassCard';
import { IntelligentSearch } from './IntelligentSearch';
import { DocumentsView } from './DocumentsView';
import { RequestsView } from './RequestsView';
import { MyTasksView } from './MyTasksView';
import { GroupChatView } from './GroupChatView';
import { StatsView } from './StatsView';
import { useData } from '../contexts/DataContext';
import { Button } from './Button';

interface DashboardProps {
  user: UserProfile;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

// Mock Database of Colleagues
const MOCK_COLLEAGUES = [
    { id: '1', name: 'Thomas Anderson', role: 'Dev' },
    { id: '2', name: 'Sophie Martin', role: 'Marketing' },
    { id: '3', name: 'Lucas Dubois', role: 'Sales' },
    { id: '4', name: 'Emma Bernard', role: 'RH' },
    { id: '5', name: 'Nathan Petit', role: 'Design' },
    { id: '6', name: 'Julie Leroy', role: 'Compta' },
];

// Connected Widgets
const HRDocsView = () => {
  const { documents, onNavigate } = useData() as any; // Using context
  // Simple filter to mock HR or Staff docs, or just show recent
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-fealty-dark">Derniers Documents</h2>
      <div className="space-y-3">
          {recentDocs.length === 0 ? (
             <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Aucun document partagé</p>
                <button className="text-sm text-fealty-dark font-bold hover:underline mt-2">Uploader un fichier</button>
             </div>
          ) : (
             recentDocs.map((doc: any) => (
               <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                     <div className="overflow-hidden">
                        <p className="font-bold text-slate-700 truncate max-w-[200px]">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.date}</p>
                     </div>
                  </div>
                  <button className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100">Voir</button>
               </div>
            ))
          )}
      </div>
    </div>
  );
};

const DirectoryView = () => {
    // In a real app with a backend, we would fetch users here.
    // For this simulation, we'll just show the current user or an empty state.
    const { currentUser } = useData();

    return (
        <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-fealty-dark mb-6">Annuaire</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-fealty-green shadow-sm cursor-pointer">
                    <div className="relative">
                       {currentUser?.avatar ? (
                         <img src={currentUser.avatar} className="w-12 h-12 rounded-full object-cover" alt="User" />
                       ) : (
                         <div className="w-12 h-12 rounded-full bg-slate-200" />
                       )}
                       <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                       <p className="font-bold text-slate-800">{currentUser?.name} (Moi)</p>
                       <p className="text-xs text-slate-500">{currentUser?.role}</p>
                    </div>
                 </div>
                 {/* Empty placeholders for effect */}
                 <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    Aucun autre membre connecté
                 </div>
             </div>
        </div>
    );
};

const CalendarView = () => (
   <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-fealty-dark mb-6">Agenda d'entreprise</h2>
      <GlassCard className="p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Calendar size={32} />
         </div>
         <h3 className="font-bold text-lg text-slate-800">Aucun événement prévu</h3>
         <p className="text-slate-500 text-sm mt-2 max-w-sm">Le calendrier des événements globaux est vide pour le moment. Les réunions créées dans les groupes apparaîtront ici.</p>
      </GlassCard>
   </div>
);

const DashboardHome: React.FC<{user: UserProfile, onNavigate: (v: ViewState) => void}> = ({user, onNavigate}) => {
  const { documents, requests, groups } = useData();
  
  // Calculate stats based on real data
  const docCount = documents.length;
  const reqCount = requests.length;
  const tasksCount = requests.filter(r => r.assignedTo === 'me').length;
  const recentDocs = documents.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold text-fealty-dark tracking-tight">Bonjour, {user.name.split(' ')[0]} ! 👋</h2>
          <p className="text-slate-500 mt-1">Votre espace de travail est prêt.</p>
        </div>
      </div>

      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => onNavigate('documents')} className="cursor-pointer group">
          <div className="p-6 flex flex-col justify-between h-44 bg-white rounded-[2rem] border border-slate-100 hover:border-fealty-green transition-all hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fealty-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-fealty-light text-fealty-dark rounded-2xl group-hover:bg-fealty-green group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-medium">Documents</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{docCount}</p>
            </div>
          </div>
        </div>
        
        <div onClick={() => onNavigate('requests')} className="cursor-pointer group">
          <div className="p-6 flex flex-col justify-between h-44 bg-white rounded-[2rem] border border-slate-100 hover:border-purple-300 transition-all hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-fealty-light text-fealty-dark rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Layers size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-medium">Demandes</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{reqCount}</p>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigate('groups')} className="cursor-pointer group">
          <div className="p-6 flex flex-col justify-between h-44 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-fealty-light text-fealty-dark rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-medium">Groupes Actifs</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{groups.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-xl text-fealty-dark flex items-center gap-2">
              Actualités
          </h3>
          <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-fealty-mint rounded-2xl flex items-center justify-center text-fealty-green mb-4">
                 <Bot size={32} />
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-2">Bienvenue sur Conisia V1</h4>
             <p className="text-slate-500 max-w-md">
                 Ceci est le début de votre nouvelle plateforme. Les actualités de l'entreprise et les annonces importantes apparaîtront ici.
             </p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-xl text-fealty-dark">Accès Rapide</h3>
          <div className="p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm min-h-[200px]">
             {recentDocs.length > 0 ? (
                 recentDocs.map((doc, idx) => (
                   <div key={idx} onClick={() => onNavigate('documents')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-fealty-dark group-hover:text-fealty-green transition-colors shadow-sm">
                        <File size={18} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:translate-x-1 transition-transform truncate">{doc.name}</span>
                      <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-fealty-dark" />
                   </div>
                 ))
             ) : (
                 <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                     <File size={24} className="mb-2 opacity-50" />
                     <p className="text-xs">Aucun fichier récent</p>
                 </div>
             )}
          </div>

          <div className="p-8 rounded-[2rem] bg-fealty-dark text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('ai-search')}>
              <div className="relative z-10">
                  <div className="w-10 h-10 bg-fealty-green rounded-xl flex items-center justify-center text-fealty-dark mb-4">
                      <Bot size={24} />
                  </div>
                  <p className="font-bold text-lg mb-1">Conisia AI</p>
                  <p className="text-slate-400 text-sm mb-4">Posez une question à vos données.</p>
                  <div className="w-full py-2 px-4 bg-white/10 rounded-lg text-sm font-semibold flex items-center justify-between group-hover:bg-white/20 transition-colors">
                      <span>Ouvrir le Chat</span>
                      <ArrowRight size={14} />
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-fealty-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupsView: React.FC<{onNavigate: (v: ViewState) => void}> = ({onNavigate}) => {
    const { groups, addGroup } = useData();
    const [isCreating, setIsCreating] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    
    // Group Member Search State
    const [memberSearch, setMemberSearch] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<{id: string, name: string}[]>([]);

    const filteredColleagues = MOCK_COLLEAGUES.filter(c => 
        c.name.toLowerCase().includes(memberSearch.toLowerCase()) && 
        !selectedMembers.some(m => m.id === c.id)
    );

    const handleCreate = () => {
        if(!newGroupName) return;
        
        addGroup({
            name: newGroupName,
            description: newGroupDesc || 'Groupe de collaboration',
            bg: 'from-slate-700 to-slate-900', // Default styling
            members: selectedMembers.length + 1 // +1 for creator
        });
        setIsCreating(false);
        setNewGroupName('');
        setNewGroupDesc('');
        setMemberSearch('');
        setSelectedMembers([]);
    }

    const addMember = (user: typeof MOCK_COLLEAGUES[0]) => {
        setSelectedMembers([...selectedMembers, user]);
        setMemberSearch('');
    };

    const removeMember = (id: string) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== id));
    };

    return (
        <div className="h-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-fealty-dark">Groupes Collaboratifs</h2>
                <div className="flex gap-2">
                     <Button onClick={() => setIsCreating(true)} variant="white">Créer le premier groupe</Button>
                     <Button onClick={() => setIsCreating(true)} className="bg-fealty-dark text-white"><Plus size={16} /> Nouveau Groupe</Button>
                </div>
            </div>

            {isCreating && (
                <div className="mb-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl animate-slide-up max-w-lg">
                    <h3 className="font-bold mb-4">Créer un nouveau groupe</h3>
                    <input 
                        className="w-full p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100 outline-none focus:ring-2 focus:ring-fealty-dark" 
                        placeholder="Nom du groupe"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        autoFocus
                    />
                     <input 
                        className="w-full p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100 outline-none focus:ring-2 focus:ring-fealty-dark" 
                        placeholder="Courte description"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                    />
                    
                    {/* User Search & Select */}
                    <div className="mb-4 relative">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Ajouter des membres</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedMembers.map(m => (
                                <span key={m.id} className="bg-fealty-light text-fealty-dark px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                    {m.name} <button onClick={() => removeMember(m.id)}><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-fealty-dark pl-9" 
                                placeholder="Rechercher un collègue..."
                                value={memberSearch}
                                onChange={e => setMemberSearch(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            
                            {/* Dropdown Results */}
                            {memberSearch && (
                                <div className="absolute top-full left-0 w-full bg-white border border-slate-100 rounded-xl mt-1 shadow-xl max-h-40 overflow-y-auto z-20">
                                    {filteredColleagues.length > 0 ? (
                                        filteredColleagues.map(c => (
                                            <div 
                                                key={c.id} 
                                                onClick={() => addMember(c)}
                                                className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                                            >
                                                <span className="text-sm font-medium text-slate-800">{c.name}</span>
                                                <span className="text-xs text-slate-400">{c.role}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-xs text-slate-400 text-center">Aucun résultat</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleCreate} disabled={!newGroupName}>Créer</Button>
                        <Button variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
                    </div>
                </div>
            )}

            {groups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Users size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun groupe actif</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Créez un espace pour votre équipe ou votre projet pour commencer à collaborer.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group, idx) => (
                        <div key={idx} onClick={() => onNavigate('group-chat')} className="relative group overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 hover:border-fealty-green hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
                            <div className={`h-28 bg-gradient-to-br ${group.bg} relative`}>
                            <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-lg font-bold text-slate-800">
                                {group.name.charAt(0)}
                            </div>
                            </div>
                            <div className="p-6 pt-8">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">{group.name}</h3>
                                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{group.members} mb</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{group.description}</p>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                    </div>
                                    <span className="text-xs font-bold text-fealty-green uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Accéder <ArrowRight size={10} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ user, currentView, onNavigate, onLogout }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, documents, requests } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'stats-view', label: 'Statistiques', icon: BarChart2 },
    { id: 'my-tasks', label: 'Mes Tâches', icon: CheckSquare },
    { id: 'requests', label: 'Mes Demandes', icon: Layers },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'groups', label: 'Groupes', icon: Users },
    { id: 'ai-search', label: 'Assistant IA', icon: Bot },
  ];

  // Search Logic
  const filteredDocuments = documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRequests = requests.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
  // Mock users filter would go here
  const filteredUsers: any[] = []; 

  const showSearchResults = searchQuery.length > 0 && (filteredDocuments.length > 0 || filteredRequests.length > 0);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardHome user={user} onNavigate={onNavigate} />;
      case 'documents': return <DocumentsView />;
      case 'requests': return <RequestsView />;
      case 'my-tasks': return <MyTasksView />;
      case 'stats-view': return <StatsView />;
      case 'groups': return <GroupsView onNavigate={onNavigate} />;
      case 'group-chat': return <GroupChatView onBack={() => onNavigate('groups')} />;
      case 'hr-view': return <HRDocsView />;
      case 'directory': return <DirectoryView />;
      case 'calendar': return <CalendarView />;
      case 'ai-search': return (
        <div className="animate-fade-in space-y-4">
             <div className="bg-fealty-dark rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
                 <div className="relative z-10">
                     <h2 className="text-3xl font-bold mb-2 text-fealty-green">Assistant Intelligent</h2>
                     <p className="opacity-90 max-w-lg text-slate-300">Posez vos questions sur les documents internes. Je connais le contenu de la plateforme.</p>
                 </div>
                 <Bot className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-5 rotate-12" />
             </div>
             <IntelligentSearch />
        </div>
      );
      default: return <DashboardHome user={user} onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-fealty-light flex font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 sticky top-0 h-screen flex flex-col transition-all z-20 shadow-sm">
        <div className="p-8 flex flex-col justify-center cursor-pointer group">
            <span className="font-extrabold text-2xl tracking-tighter text-fealty-dark leading-none lowercase">
                conisia.
            </span>
            <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 rounded-full mt-1 group-hover:w-24 transition-all duration-300 ease-out" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'groups' && currentView === 'group-chat');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-fealty-dark text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-fealty-dark'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-fealty-green' : 'group-hover:scale-110 transition-transform'} />
                <span className="hidden lg:block font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
              {user.avatar ? (
                 <div className="w-10 h-10 rounded-full bg-slate-300 bg-cover bg-center border-2 border-white shadow-sm" style={{backgroundImage: `url(${user.avatar})`}} />
              ) : (
                 <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm flex items-center justify-center text-slate-500"><Users size={20} /></div>
              )}
              <div className="hidden lg:block overflow-hidden text-left">
                 <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                 <p className="text-[10px] uppercase font-bold text-slate-400 truncate tracking-wider">{user.role}</p>
              </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
           >
             <LogOut size={18} />
             <span className="hidden lg:block">Déconnexion</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <header className="h-24 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-slate-100">
           <div>
             <h1 className="text-xl font-bold text-fealty-dark capitalize hidden md:block">
               {currentView === 'group-chat' ? 'Discussion' : 
                (currentView === 'ai-search' ? 'Intelligence Artificielle' : 
                 (currentView === 'requests' ? 'Mes Demandes Envoyées' : 
                 (currentView === 'my-tasks' ? 'Mes Tâches Assignées' : 
                  (currentView === 'stats-view' ? 'Statistiques Globales' :
                  (currentView === 'dashboard' ? 'Vue d\'ensemble' : currentView)))))}
             </h1>
           </div>
           
           <div className="flex items-center gap-6 ml-auto">
              {/* Global Search */}
              <div className="relative hidden md:block group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-fealty-dark transition-colors" size={18} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Rechercher..." 
                   className="pl-12 pr-4 py-3 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-fealty-dark/10 w-72 text-sm font-medium transition-all focus:w-80"
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up z-50">
                        {filteredDocuments.length > 0 && (
                            <div className="p-3 border-b border-slate-50">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">Documents</p>
                                {filteredDocuments.slice(0, 3).map(d => (
                                    <div key={d.id} onClick={() => { onNavigate('documents'); setSearchQuery(''); }} className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-2">
                                        <File size={14} className="text-slate-400" /> <span className="text-sm text-slate-700 truncate">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {filteredRequests.length > 0 && (
                            <div className="p-3 border-b border-slate-50">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">Demandes</p>
                                {filteredRequests.slice(0, 3).map(r => (
                                    <div key={r.id} onClick={() => { onNavigate(r.createdBy === 'me' ? 'requests' : 'my-tasks'); setSearchQuery(''); }} className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-2">
                                        <Layers size={14} className="text-slate-400" /> <span className="text-sm text-slate-700 truncate">{r.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
              </div>
              
              <div className="relative">
                  <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-fealty-dark hover:border-fealty-dark hover:shadow-md transition-all"
                  >
                     <Bell size={20} />
                     {unreadCount > 0 && <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up origin-top-right z-50">
                          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                              <h4 className="font-bold text-slate-800">Notifications</h4>
                              {unreadCount > 0 && (
                                  <button onClick={markAllNotificationsRead} className="text-xs text-fealty-green font-bold hover:underline">Tout marquer lu</button>
                              )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                              {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-slate-400 text-sm">Aucune notification</div>
                              ) : (
                                  notifications.map(notif => (
                                      <div 
                                        key={notif.id} 
                                        onClick={() => markNotificationRead(notif.id)}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notif.read ? 'bg-fealty-green/5' : ''}`}
                                      >
                                          {!notif.read && <div className="absolute left-2 top-6 w-1.5 h-1.5 bg-fealty-green rounded-full" />}
                                          <div className="flex justify-between items-start mb-1">
                                              <p className="font-bold text-sm text-slate-800">{notif.title}</p>
                                              <span className="text-[10px] text-slate-400">{notif.date}</span>
                                          </div>
                                          <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  )}
              </div>
           </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth custom-scrollbar">
           <div className="max-w-7xl mx-auto h-full">
             {renderContent()}
           </div>
        </main>
      </div>
    </div>
  );
};