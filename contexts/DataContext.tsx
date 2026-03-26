import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AppDocument, ServiceRequest, Notification, Department, DocumentVersion, Group } from '../types';
import { auth, db, signInWithGoogle, logOut, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

interface DataContextType {
  currentUser: UserProfile | null;
  documents: AppDocument[];
  requests: ServiceRequest[];
  notifications: Notification[];
  groups: Group[];
  users: UserProfile[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            // Create new user
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName || 'Utilisateur',
              email: user.email || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              role: '',
              department: 'STAFF',
              onboardingCompleted: false,
              skills: [],
              currentProjects: []
            });
          }
          
          // Listen to user profile changes
          onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setCurrentUser({
                id: data.uid,
                name: data.displayName,
                email: data.email,
                role: data.role || '',
                department: data.department || 'STAFF',
                avatar: data.photoURL || '',
                onboardingCompleted: data.onboardingCompleted || false,
                skills: data.skills || [],
                currentProjects: data.currentProjects || []
              });
            }
          }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));
          
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!isAuthReady || !currentUser) return;

    // Listen to Documents
    const qDocs = query(collection(db, 'documents'), where('ownerId', '==', currentUser.id));
    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      const docsData: AppDocument[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docsData.push({
          id: doc.id,
          name: data.name,
          type: data.type,
          size: data.size || '0 KB',
          date: data.createdAt ? data.createdAt.split('T')[0] : '',
          uploader: data.uploader || currentUser.name,
          department: data.department || currentUser.department,
          tags: data.tags || [],
          permissions: data.permissions || [],
          versions: data.versions || [],
          aiDescription: data.aiDescription,
          isPinned: data.isPinned || false,
          url: data.url
        });
      });
      setDocuments(docsData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'documents'));

    // Listen to Groups
    const qGroups = query(collection(db, 'groups'), where('members', 'array-contains', currentUser.id));
    const unsubGroups = onSnapshot(qGroups, (snapshot) => {
      const groupsData: Group[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        groupsData.push({
          id: doc.id,
          name: data.name,
          members: data.members || [],
          bg: data.bg || 'bg-slate-100',
          description: data.description || ''
        });
      });
      setGroups(groupsData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'groups'));

    // Listen to Users
    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const usersData: UserProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: data.uid,
          name: data.displayName,
          email: data.email,
          role: data.role || '',
          department: data.department || 'STAFF',
          avatar: data.photoURL || '',
          onboardingCompleted: data.onboardingCompleted || false,
          skills: data.skills || [],
          currentProjects: data.currentProjects || []
        });
      });
      setUsers(usersData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    // Listen to Requests (Sent or Received)
    const qRequestsSent = query(collection(db, 'requests'), where('senderId', '==', currentUser.id));
    const qRequestsReceived = query(collection(db, 'requests'), where('assignedTo', '==', currentUser.id));
    
    const handleRequestsSnapshot = (snapshot: any, type: 'sent' | 'received') => {
      setRequests(prev => {
        const newReqs = [...prev];
        snapshot.docChanges().forEach((change: any) => {
          const data = change.doc.data();
          const req: ServiceRequest = {
            id: change.doc.id,
            title: data.title,
            description: data.description,
            department: data.department || 'STAFF',
            assignedTo: data.assignedTo || '',
            createdBy: data.senderId === currentUser.id ? 'me' : data.senderId, // Store sender ID
            status: data.status === 'pending' ? 'TODO' : data.status === 'in-progress' ? 'IN_PROGRESS' : 'DONE',
            priority: data.priority || 'MEDIUM',
            steps: data.steps || [],
            createdAt: data.createdAt ? data.createdAt.split('T')[0] : ''
          };

          if (change.type === 'added' || change.type === 'modified') {
            const index = newReqs.findIndex(r => r.id === req.id);
            if (index >= 0) newReqs[index] = req;
            else newReqs.push(req);
          } else if (change.type === 'removed') {
            const index = newReqs.findIndex(r => r.id === req.id);
            if (index >= 0) newReqs.splice(index, 1);
          }
        });
        return newReqs;
      });
    };

    const unsubRequestsSent = onSnapshot(qRequestsSent, (snapshot) => handleRequestsSnapshot(snapshot, 'sent'), (error) => handleFirestoreError(error, OperationType.LIST, 'requests'));
    const unsubRequestsReceived = onSnapshot(qRequestsReceived, (snapshot) => handleRequestsSnapshot(snapshot, 'received'), (error) => handleFirestoreError(error, OperationType.LIST, 'requests'));

    return () => {
      unsubDocs();
      unsubGroups();
      unsubUsers();
      unsubRequestsSent();
      unsubRequestsReceived();
    };
  }, [isAuthReady, currentUser]);

  const login = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await logOut();
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const addDocument = async (docData: Omit<AppDocument, 'id' | 'date' | 'permissions' | 'versions' | 'tags'>) => {
    if (!currentUser) return;
    try {
      const newDocRef = doc(collection(db, 'documents'));
      await setDoc(newDocRef, {
        id: newDocRef.id,
        name: docData.name,
        type: docData.type,
        size: docData.size,
        uploader: docData.uploader,
        department: docData.department,
        url: docData.url || '',
        tags: [],
        permissions: [],
        versions: [{
          id: newDocRef.id + 'v1',
          version: '1.0',
          date: new Date().toISOString().split('T')[0],
          author: currentUser.name,
          changes: 'Version initiale',
          url: docData.url || '#'
        }],
        ownerId: currentUser.id,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'documents');
    }
  };

  const addTagToDocument = async (docId: string, tag: string) => {
    const docToUpdate = documents.find(d => d.id === docId);
    if (!docToUpdate || docToUpdate.tags.includes(tag)) return;
    try {
      await updateDoc(doc(db, 'documents', docId), {
        tags: [...docToUpdate.tags, tag]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  };

  const removeTagFromDocument = async (docId: string, tag: string) => {
    const docToUpdate = documents.find(d => d.id === docId);
    if (!docToUpdate) return;
    try {
      await updateDoc(doc(db, 'documents', docId), {
        tags: docToUpdate.tags.filter(t => t !== tag)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  };

  const shareDocument = async (docId: string, targetId: string, type: 'USER' | 'GROUP', access: 'READ' | 'EDIT') => {
    const docToUpdate = documents.find(d => d.id === docId);
    if (!docToUpdate) return;
    try {
      const newPerm = {
        userId: type === 'USER' ? targetId : undefined,
        groupId: type === 'GROUP' ? targetId : undefined,
        access
      };
      await updateDoc(doc(db, 'documents', docId), {
        permissions: [...docToUpdate.permissions, newPerm]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  };

  const addRequest = async (req: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    try {
      const newReqRef = doc(collection(db, 'requests'));
      await setDoc(newReqRef, {
        id: newReqRef.id,
        title: req.title,
        description: req.description,
        department: req.department,
        status: 'pending',
        senderId: currentUser.id,
        recipientIds: [], // In a real app, populate this based on assignedTo or department
        priority: req.priority,
        steps: req.steps || [],
        assignedTo: req.assignedTo,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'requests');
    }
  };

  const updateRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const fbStatus = status === 'TODO' ? 'pending' : status === 'IN_PROGRESS' ? 'in-progress' : 'completed';
      await updateDoc(doc(db, 'requests', id), { status: fbStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };

  const updateRequestPriority = async (id: string, priority: ServiceRequest['priority']) => {
    try {
      await updateDoc(doc(db, 'requests', id), { priority });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };
  
  const updateRequestDepartment = async (id: string, department: Department) => {
    try {
      await updateDoc(doc(db, 'requests', id), { department });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };

  const toggleRequestStep = async (reqId: string, stepId: string) => {
    const reqToUpdate = requests.find(r => r.id === reqId);
    if (!reqToUpdate || !reqToUpdate.steps) return;
    try {
      const updatedSteps = reqToUpdate.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
      await updateDoc(doc(db, 'requests', reqId), { steps: updatedSteps });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'documents');
    }
  };

  const togglePinDocument = async (id: string) => {
    const docToUpdate = documents.find(d => d.id === id);
    if (!docToUpdate) return;
    try {
      await updateDoc(doc(db, 'documents', id), { isPinned: !docToUpdate.isPinned });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  }

  const updateDocumentDescription = async (id: string, description: string) => {
    try {
      await updateDoc(doc(db, 'documents', id), { aiDescription: description });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  }

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addGroup = async (groupData: Omit<Group, 'id'>) => {
    if (!currentUser) return;
    try {
      const newGroupRef = doc(collection(db, 'groups'));
      await setDoc(newGroupRef, {
        id: newGroupRef.id,
        name: groupData.name,
        members: [...groupData.members, currentUser.id], // Add current user as member
        ownerId: currentUser.id,
        bg: groupData.bg,
        description: groupData.description,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'groups');
    }
  }

  return (
    <DataContext.Provider value={{
      currentUser,
      documents,
      requests,
      notifications,
      groups,
      users,
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