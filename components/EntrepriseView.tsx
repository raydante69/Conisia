import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, MessageSquare, Users, Plus, X, FileText, Send, Paperclip, MoreVertical, Trash2, ArrowLeft, Settings, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Group, UserProfile, GroupMessage, DirectMessage } from '../types';

export const EntrepriseView: React.FC = () => {
    const { users, groups, currentUser, addGroup, updateGroup, deleteGroup } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChat, setActiveChat] = useState<{ type: 'group' | 'direct', id: string } | null>(null);
    const [directConversations, setDirectConversations] = useState<string[]>([]);
    
    // Group creation state
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<UserProfile[]>([]);

    // Fetch direct conversations
    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, 'direct_messages'), where('conversationId', '>=', currentUser.id), where('conversationId', '<=', currentUser.id + '\uf8ff'));
        const q2 = query(collection(db, 'direct_messages'), where('conversationId', '>=', ''), where('conversationId', '<=', '\uf8ff'));
        // A better way to get conversations is to just fetch all where conversationId contains currentUser.id
        // Since we can't easily do a "contains" query in firestore without a specific array, we'll fetch all direct messages the user is part of and extract unique conversation IDs.
        // Actually, we can just fetch all direct messages where the user is a participant.
        // Wait, firestore rules allow read if conversationId matches ".*uid.*".
        // But query requires exact match or array-contains.
        // Let's just fetch all users and if there's a message history, we show it.
        // For simplicity, we can just show all users in the search and if clicked, open chat.
        // To show recent conversations, we'd need a `conversations` collection.
        // Let's just list all users as potential contacts for now, or fetch messages where senderId == currentUser.id or receiverId == currentUser.id.
        // Wait, we didn't add a receiverId, we used conversationId.
        // Let's just list all users in the company.
    }, [currentUser]);

    const filteredUsers = users.filter(u => 
        u.id !== currentUser?.id && 
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateGroup = () => {
        if (!newGroupName) return;
        addGroup({
            name: newGroupName,
            description: newGroupDesc || 'Groupe de collaboration',
            bg: 'from-slate-700 to-slate-900',
            members: selectedMembers.map(m => m.id),
            ownerId: currentUser!.id
        });
        setIsCreatingGroup(false);
        setNewGroupName('');
        setNewGroupDesc('');
        setSelectedMembers([]);
    };

    const getConversationId = (uid1: string, uid2: string) => {
        return [uid1, uid2].sort().join('_');
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 animate-fade-in">
            {/* Left Sidebar: Search & Lists */}
            <div className={`w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="relative">
                    <input 
                        type="text"
                        placeholder="Rechercher un collègue ou un groupe..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-fealty-green outline-none shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
                    {/* Groups Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Groupes</h3>
                            <button onClick={() => setIsCreatingGroup(true)} className="p-1 hover:bg-slate-200 rounded-md text-slate-500"><Plus size={16} /></button>
                        </div>
                        <div className="space-y-2">
                            {filteredGroups.map(group => (
                                <div 
                                    key={group.id} 
                                    onClick={() => setActiveChat({ type: 'group', id: group.id })}
                                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${activeChat?.id === group.id ? 'bg-fealty-green/10 border border-fealty-green/20' : 'bg-white border border-slate-100 hover:border-slate-300 shadow-sm'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold shadow-sm">
                                        {group.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-slate-800 truncate">{group.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{group.members.length} membres</p>
                                    </div>
                                </div>
                            ))}
                            {filteredGroups.length === 0 && <p className="text-sm text-slate-400 italic">Aucun groupe trouvé.</p>}
                        </div>
                    </div>

                    {/* Direct Messages Section */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Collègues</h3>
                        <div className="space-y-2">
                            {filteredUsers.map(user => (
                                <div 
                                    key={user.id} 
                                    onClick={() => setActiveChat({ type: 'direct', id: user.id })}
                                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${activeChat?.id === user.id ? 'bg-fealty-green/10 border border-fealty-green/20' : 'bg-white border border-slate-100 hover:border-slate-300 shadow-sm'}`}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{user.department}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredUsers.length === 0 && <p className="text-sm text-slate-400 italic">Aucun collègue trouvé.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Area: Chat or Create Group */}
            <div className={`flex-1 flex flex-col bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden ${!activeChat && !isCreatingGroup ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {isCreatingGroup ? (
                    <div className="p-8 max-w-2xl w-full mx-auto animate-fade-in overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Créer un groupe</h2>
                            <button onClick={() => setIsCreatingGroup(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nom du groupe</label>
                                <input 
                                    type="text" 
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-fealty-green outline-none"
                                    placeholder="Ex: Projet Alpha"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={newGroupDesc}
                                    onChange={e => setNewGroupDesc(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-fealty-green outline-none"
                                    placeholder="Courte description du groupe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Membres</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedMembers.map(m => (
                                        <span key={m.id} className="bg-fealty-light text-fealty-dark px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                            {m.name} <button onClick={() => setSelectedMembers(prev => prev.filter(u => u.id !== m.id))}><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 p-2 space-y-1">
                                    {users.filter(u => u.id !== currentUser?.id && !selectedMembers.find(m => m.id === u.id)).map(u => (
                                        <div 
                                            key={u.id} 
                                            onClick={() => setSelectedMembers([...selectedMembers, u])}
                                            className="p-2 hover:bg-white rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{u.name.charAt(0)}</div>
                                            <span className="text-sm font-medium">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>Annuler</Button>
                                <Button className="bg-fealty-dark text-white" onClick={handleCreateGroup} disabled={!newGroupName}>Créer le groupe</Button>
                            </div>
                        </div>
                    </div>
                ) : activeChat ? (
                    <ChatWindow 
                        chatType={activeChat.type} 
                        chatId={activeChat.id} 
                        onBack={() => setActiveChat(null)} 
                    />
                ) : (
                    <div className="text-center opacity-50">
                        <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-medium text-slate-500">Sélectionnez une conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChatWindow: React.FC<{ chatType: 'group' | 'direct', chatId: string, onBack: () => void }> = ({ chatType, chatId, onBack }) => {
    const { users, groups, currentUser, updateGroup, deleteGroup } = useData();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [attachment, setAttachment] = useState<{ url: string, name: string, type: string, size: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSettings, setShowSettings] = useState(false);

    const isGroup = chatType === 'group';
    const group = isGroup ? groups.find(g => g.id === chatId) : null;
    const directUser = !isGroup ? users.find(u => u.id === chatId) : null;
    
    const chatName = isGroup ? group?.name : directUser?.name;
    const conversationId = !isGroup && currentUser ? [currentUser.id, chatId].sort().join('_') : '';

    useEffect(() => {
        if (!currentUser) return;
        
        let q;
        if (isGroup) {
            q = query(collection(db, 'group_messages'), where('groupId', '==', chatId), orderBy('timestamp', 'asc'));
        } else {
            q = query(collection(db, 'direct_messages'), where('conversationId', '==', conversationId), orderBy('timestamp', 'asc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: any[] = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }, (error) => handleFirestoreError(error, OperationType.LIST, isGroup ? 'group_messages' : 'direct_messages'));

        return () => unsubscribe();
    }, [chatId, chatType, currentUser, conversationId]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1000000) {
            alert("Le fichier est trop volumineux (limite 1MB).");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachment({
                url: reader.result as string,
                name: file.name,
                type: file.type,
                size: (file.size / 1024).toFixed(1) + ' KB'
            });
        };
        reader.readAsDataURL(file);
    };

    const sendMessage = async () => {
        if ((!inputValue.trim() && !attachment) || !currentUser) return;
        
        const baseMsg = {
            senderId: currentUser.id,
            text: inputValue.trim(),
            timestamp: new Date().toISOString(),
            ...(attachment ? { attachment } : {})
        };

        setInputValue('');
        setAttachment(null);
        
        try {
            if (isGroup) {
                await addDoc(collection(db, 'group_messages'), { ...baseMsg, groupId: chatId });
            } else {
                await addDoc(collection(db, 'direct_messages'), { ...baseMsg, conversationId });
            }
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, isGroup ? 'group_messages' : 'direct_messages');
        }
    };

    const handleDeleteGroup = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
            await deleteGroup(chatId);
            onBack();
        }
    };

    if (!chatName) return null;

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
                    {isGroup ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold">
                            {chatName.charAt(0)}
                        </div>
                    ) : (
                        directUser?.avatar ? (
                            <img src={directUser.avatar} alt={chatName} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {chatName.charAt(0)}
                            </div>
                        )
                    )}
                    <div>
                        <h3 className="font-bold text-slate-800">{chatName}</h3>
                        {isGroup && <p className="text-xs text-slate-500">{group?.members.length} membres</p>}
                    </div>
                </div>
                {isGroup && group?.ownerId === currentUser?.id && (
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <Settings size={20} />
                    </button>
                )}
            </div>

            {/* Settings Panel (Group Owner) */}
            {showSettings && isGroup && group && (
                <div className="absolute top-16 right-4 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 z-20 animate-fade-in">
                    <h4 className="font-bold text-slate-800 mb-4">Paramètres du groupe</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nom</label>
                            <input 
                                type="text" 
                                defaultValue={group.name} 
                                onBlur={(e) => updateGroup(group.id, { name: e.target.value })}
                                className="w-full p-2 text-sm rounded-lg bg-slate-50 border border-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                            <input 
                                type="text" 
                                defaultValue={group.description} 
                                onBlur={(e) => updateGroup(group.id, { description: e.target.value })}
                                className="w-full p-2 text-sm rounded-lg bg-slate-50 border border-slate-200"
                            />
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <button onClick={handleDeleteGroup} className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors">
                                <Trash2 size={16} /> Supprimer le groupe
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <MessageSquare size={48} className="mb-4" />
                        <p className="text-slate-500 text-sm">Démarrez la conversation...</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const sender = users.find(u => u.id === msg.senderId);
                    const senderName = isMe ? 'Moi' : (sender?.name || 'Inconnu');
                    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {!isMe && (
                                sender?.avatar ? 
                                <img src={sender.avatar} className="w-8 h-8 rounded-full mt-auto mb-1" alt={senderName} referrerPolicy="no-referrer" /> :
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 mt-auto mb-1">{senderName.charAt(0)}</div>
                            )}
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                {!isMe && <span className="text-xs text-slate-500 mb-1 ml-1">{senderName}</span>}
                                
                                {msg.attachment && (
                                    <div className={`mb-1 p-2 rounded-xl border ${isMe ? 'bg-fealty-dark/10 border-fealty-dark/20' : 'bg-white border-slate-200'}`}>
                                        {msg.attachment.type.startsWith('image/') ? (
                                            <img src={msg.attachment.url} alt="attachment" className="max-w-full h-auto max-h-48 rounded-lg object-contain" />
                                        ) : (
                                            <a href={msg.attachment.url} download={msg.attachment.name} className="flex items-center gap-2 text-sm font-medium hover:underline">
                                                <FileText size={16} /> {msg.attachment.name} ({msg.attachment.size})
                                            </a>
                                        )}
                                    </div>
                                )}

                                {msg.text && (
                                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                                        isMe 
                                        ? 'bg-fealty-dark text-white rounded-tr-sm' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                )}
                                <span className="text-[10px] text-slate-400 mt-1 mx-1">{timeStr}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                {attachment && (
                    <div className="mb-3 flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                        {attachment.type.startsWith('image/') ? <ImageIcon size={16} className="text-slate-500" /> : <FileText size={16} className="text-slate-500" />}
                        <span className="text-sm text-slate-700 truncate flex-1">{attachment.name}</span>
                        <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                    </div>
                )}
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-fealty-dark transition-colors rounded-full hover:bg-slate-200"
                    >
                        <Paperclip size={20} />
                    </button>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Écrivez votre message..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none px-2"
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={!inputValue.trim() && !attachment}
                        className="p-2 bg-fealty-dark text-white rounded-full hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
