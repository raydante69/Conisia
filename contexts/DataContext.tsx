import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AppDocument, ServiceRequest, Notification, Department, DocumentVersion, Group } from '../types';

interface DataContextType {
  currentUser: UserProfile | null;
  documents: AppDocument[];
  requests: ServiceRequest[];
  notifications: Notification[];
  groups: Group[];
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addDocument: (doc: Omit<AppDocument, 'id' | 'date' | 'permissions' | 'versions' | 'tags'>) => void;
  addTagToDocument: (docId: string, tag: string) => void;
  removeTagFromDocument: (docId: string, tag: string) => void;
  shareDocument: (docId: string, targetId: string, type: 'USER' | 'GROUP', access: 'READ' | 'EDIT') => void;
  addRequest: (req: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  updateRequestPriority: (id: string, priority: ServiceRequest['priority']) => void;
  updateRequestDepartment: (id: string, dept: Department) => void;
  toggleRequestStep: (reqId: string, stepId: string) => void;
  deleteDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  togglePinDocument: (id: string) => void;
  updateDocumentDescription: (id: string, description: string) => void;
  addGroup: (group: Omit<Group, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// PRODUCTION INITIAL STATE: EMPTY
const INITIAL_DOCS: AppDocument[] = [];
const INITIAL_REQUESTS: ServiceRequest[] = [];
const INITIAL_NOTIFICATIONS: Notification[] = [
    { 
        id: 'welcome', 
        userId: 'me', 
        title: 'Bienvenue sur Conisia', 
        message: 'Votre espace de travail est prêt. Commencez par configurer votre profil ou uploader un document.', 
        type: 'SYSTEM', 
        read: false, 
        date: 'À l\'instant' 
    }
];
const INITIAL_GROUPS: Group[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<AppDocument[]>(INITIAL_DOCS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  // Load from LocalStorage on mount (Production Keys)
  useEffect(() => {
    const savedUser = localStorage.getItem('conisia_prod_user');
    const savedDocs = localStorage.getItem('conisia_prod_docs');
    const savedReqs = localStorage.getItem('conisia_prod_reqs');
    const savedNotifs = localStorage.getItem('conisia_prod_notifs');
    const savedGroups = localStorage.getItem('conisia_prod_groups');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    if (savedReqs) setRequests(JSON.parse(savedReqs));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
  }, []);

  // Save changes
  useEffect(() => {
    if (currentUser) localStorage.setItem('conisia_prod_user', JSON.stringify(currentUser));
    localStorage.setItem('conisia_prod_docs', JSON.stringify(documents));
    localStorage.setItem('conisia_prod_reqs', JSON.stringify(requests));
    localStorage.setItem('conisia_prod_notifs', JSON.stringify(notifications));
    localStorage.setItem('conisia_prod_groups', JSON.stringify(groups));
  }, [currentUser, documents, requests, notifications, groups]);

  const login = (email: string) => {
    const user: UserProfile = {
      id: 'me', 
      email,
      name: '',
      role: '',
      department: 'STAFF',
      avatar: '',
      onboardingCompleted: false,
      skills: [],
      currentProjects: []
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('conisia_prod_user');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
  };

  const addDocument = (doc: Omit<AppDocument, 'id' | 'date' | 'permissions' | 'versions' | 'tags'>) => {
    const newDoc: AppDocument = {
      ...doc,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      permissions: [],
      versions: [{
          id: Date.now().toString() + 'v1',
          version: '1.0',
          date: new Date().toISOString().split('T')[0],
          author: currentUser?.name || 'Moi',
          changes: 'Version initiale',
          url: doc.url || '#'
      }],
      tags: [],
      isPinned: false
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const addTagToDocument = (docId: string, tag: string) => {
      setDocuments(prev => prev.map(doc => {
          if (doc.id === docId && !doc.tags.includes(tag)) {
              return { ...doc, tags: [...doc.tags, tag] };
          }
          return doc;
      }));
  };

  const removeTagFromDocument = (docId: string, tag: string) => {
      setDocuments(prev => prev.map(doc => {
          if (doc.id === docId) {
              return { ...doc, tags: doc.tags.filter(t => t !== tag) };
          }
          return doc;
      }));
  };

  const shareDocument = (docId: string, targetId: string, type: 'USER' | 'GROUP', access: 'READ' | 'EDIT') => {
      setDocuments(prev => prev.map(doc => {
          if (doc.id === docId) {
             const newPerm = {
                 userId: type === 'USER' ? targetId : undefined,
                 groupId: type === 'GROUP' ? targetId : undefined,
                 access
             };
             return { ...doc, permissions: [...doc.permissions, newPerm] };
          }
          return doc;
      }));

      const notif: Notification = {
          id: Date.now().toString(),
          userId: 'target',
          title: 'Nouveau partage',
          message: `${currentUser?.name || 'Un utilisateur'} a partagé un document avec ${type === 'GROUP' ? 'votre groupe' : 'vous'}.`,
          type: 'SHARE',
          read: false,
          date: 'À l\'instant'
      };
      setNotifications(prev => [notif, ...prev]);
  };

  const addRequest = (req: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      ...req,
      id: 'req-' + Date.now().toString(),
      status: 'TODO',
      createdBy: 'me',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const updateRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const updateRequestPriority = (id: string, priority: ServiceRequest['priority']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, priority } : r));
  };
  
  const updateRequestDepartment = (id: string, department: Department) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, department } : r));
  };

  const toggleRequestStep = (reqId: string, stepId: string) => {
    setRequests(prev => prev.map(r => {
        if (r.id === reqId && r.steps) {
            return {
                ...r,
                steps: r.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
            };
        }
        return r;
    }));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const togglePinDocument = (id: string) => {
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d));
  }

  const updateDocumentDescription = (id: string, description: string) => {
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, aiDescription: description } : d));
  }

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addGroup = (group: Omit<Group, 'id'>) => {
      const newGroup: Group = {
          ...group,
          id: 'grp-' + Date.now()
      };
      setGroups(prev => [newGroup, ...prev]);
  }

  return (
    <DataContext.Provider value={{
      currentUser,
      documents,
      requests,
      notifications,
      groups,
      login,
      logout,
      updateProfile,
      addDocument,
      addTagToDocument,
      removeTagFromDocument,
      shareDocument,
      addRequest,
      updateRequestStatus,
      updateRequestPriority,
      updateRequestDepartment,
      toggleRequestStep,
      deleteDocument,
      markNotificationRead,
      markAllNotificationsRead,
      togglePinDocument,
      updateDocumentDescription,
      addGroup
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};