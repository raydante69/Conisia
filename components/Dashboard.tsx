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
import { EntrepriseView } from './EntrepriseView';
import { StatsView } from './StatsView';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { useData } from '../contexts/DataContext';
import { Button } from './Button';

interface DashboardProps {
  user: UserProfile;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

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
    const { currentUser, users } = useData();

    return (
        <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-fealty-dark mb-6">Annuaire</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {users.map(u => (
                     <div key={u.id} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm cursor-pointer ${u.id === currentUser?.id ? 'border-fealty-green' : 'border-slate-100'}`}>
                        <div className="relative">
                           {u.avatar ? (
                             <img src={u.avatar} className="w-12 h-12 rounded-full object-cover" alt={u.name} />
                           ) : (
                             <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">{u.name.charAt(0)}</div>
                           )}
                           {u.id === currentUser?.id && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div>
                           <p className="font-bold text-slate-800">{u.name} {u.id === currentUser?.id && '(Moi)'}</p>
                           <p className="text-xs text-slate-500">{u.role || u.department}</p>
                        </div>
                     </div>
                 ))}
                 {users.length === 0 && (
                     <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                        Aucun membre
                     </div>
                 )}
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
  const { documents, requests } = useData();
  
  // Get tasks assigned to me, not done, sorted by date (chronological)
  const myTasks = requests
    .filter(r => r.assignedTo === user.id && r.status !== 'DONE')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const recentDocs = documents.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold text-fealty-dark tracking-tight">Bonjour, {user.name.split(' ')[0]} ! 👋</h2>
          <p className="text-slate-500 mt-1">Votre espace de travail est prêt.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-xl text-fealty-dark flex items-center gap-2">
              Tâches prioritaires
          </h3>
          <div className="space-y-4">
             {myTasks.length > 0 ? (
               myTasks.map((task) => (
                 <div key={task.id} onClick={() => onNavigate('my-tasks')} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-fealty-dark transition-colors">{task.title}</h4>
                            <p className="text-xs text-slate-500">Créé le : {task.createdAt}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {task.priority}
                        </span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-fealty-dark transition-transform group-hover:translate-x-1" />
                    </div>
                 </div>
               ))
             ) : (
               <div className="p-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-fealty-mint rounded-2xl flex items-center justify-center text-fealty-green mb-4">
                      <Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Aucune tâche urgente</h4>
                  <p className="text-slate-500 max-w-md">
                      Vous n'avez aucune tâche assignée en attente pour le moment.
                  </p>
               </div>
             )}
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



export const Dashboard: React.FC<DashboardProps> = ({ user, currentView, onNavigate, onLogout }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, documents, requests } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'stats-view', label: 'Statistiques', icon: BarChart2 },
    { id: 'my-tasks', label: 'Mes Tâches', icon: CheckSquare },
    { id: 'requests', label: 'Mes Demandes', icon: Layers },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'groups', label: 'Entreprise', icon: Users },
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
      case 'groups': return <EntrepriseView />;
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
           <div 
             className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100"
             onClick={() => setIsProfileModalOpen(true)}
           >
              {user.avatar ? (
                 <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt={user.name} referrerPolicy="no-referrer" />
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
        <header className="h-0 bg-transparent sticky top-0 z-20 pl-[7px] pr-[26px] flex items-start justify-end pointer-events-none">
           <div className="flex items-center gap-6 mt-[100px] pointer-events-auto">
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
      <ProfileSettingsModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};