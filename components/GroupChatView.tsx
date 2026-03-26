import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Paperclip, MoreVertical, Search, Phone, Video, Users, ArrowLeft } from 'lucide-react';
import { GroupMessage } from '../types';
import { useData } from '../contexts/DataContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

interface GroupChatViewProps {
  onBack: () => void;
  groupId: string;
}

export const GroupChatView: React.FC<GroupChatViewProps> = ({ onBack, groupId }) => {
  const { groups, users, currentUser } = useData();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === groupId);
  const groupName = group?.name || "Discussion Groupe";
  const groupMembers = group?.members.map(memberId => users.find(u => u.id === memberId)).filter(Boolean) || [];

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, 'group_messages'),
      where('groupId', '==', groupId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: GroupMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          groupId: data.groupId,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp
        });
      });
      setMessages(msgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'group_messages'));

    return () => unsubscribe();
  }, [groupId]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentUser) return;
    
    const newMsg = {
      groupId,
      senderId: currentUser.id,
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setInputValue(''); // Optimistic clear
    
    try {
      await addDoc(collection(db, 'group_messages'), newMsg);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'group_messages');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fade-in">
       {/* Sidebar - Members & Info (Desktop only) */}
       <div className="hidden md:flex w-72 flex-col gap-6">
          <GlassCard className="p-6 flex flex-col items-center text-center">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 mb-4 shadow-lg" />
             <h3 className="font-bold text-lg text-slate-800">{groupName}</h3>
             <p className="text-slate-500 text-sm mb-4">Groupe privé</p>
             <div className="flex gap-2">
                <button className="p-2 rounded-full bg-slate-100 hover:bg-conisia-purple hover:text-white transition-colors"><Phone size={18} /></button>
                <button className="p-2 rounded-full bg-slate-100 hover:bg-conisia-purple hover:text-white transition-colors"><Video size={18} /></button>
                <button className="p-2 rounded-full bg-slate-100 hover:bg-conisia-purple hover:text-white transition-colors"><Search size={18} /></button>
             </div>
          </GlassCard>

          <GlassCard className="flex-1 p-4 overflow-hidden flex flex-col">
             <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={16} /> Membres ({groupMembers.length})</h4>
             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {groupMembers.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3">
                        {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                {member.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm font-medium text-slate-700">{member.name} {member.id === currentUser?.id ? '(Moi)' : ''}</span>
                    </div>
                ))}
             </div>
          </GlassCard>
       </div>

       {/* Chat Area */}
       <GlassCard className="flex-1 flex flex-col overflow-hidden bg-white/60 shadow-xl border-slate-200">
          {/* Mobile Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
             <div className="flex items-center gap-3">
                <button onClick={onBack} className="md:hidden p-2 hover:bg-slate-200 rounded-full"><ArrowLeft size={20} /></button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 md:hidden" />
                <div>
                   <h3 className="font-bold text-slate-800">{groupName}</h3>
                </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
             {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <p className="text-slate-400 text-sm">Démarrez la conversation...</p>
                </div>
             )}
             {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                const sender = users.find(u => u.id === msg.senderId);
                const senderName = isMe ? 'Moi' : (sender?.name || 'Inconnu');
                const senderAvatar = sender?.avatar;
                const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                       {!isMe && (
                           senderAvatar ? 
                           <img src={senderAvatar} className="w-8 h-8 rounded-full mt-auto mb-1" alt={senderName} referrerPolicy="no-referrer" /> :
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 mt-auto mb-1">{senderName.charAt(0)}</div>
                       )}
                       <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          {!isMe && <span className="text-xs text-slate-500 mb-1 ml-1">{senderName}</span>}
                          <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                             isMe 
                             ? 'bg-conisia-purple text-white rounded-tr-sm' 
                             : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                          }`}>
                             {msg.text}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 mx-1">{timeStr}</span>
                       </div>
                    </div>
                );
             })}
             <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-full">
                <button className="p-2 text-slate-400 hover:text-conisia-purple transition-colors rounded-full hover:bg-slate-200">
                   <Paperclip size={20} />
                </button>
                <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                   placeholder="Écrivez votre message..." 
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                />
                <button 
                   onClick={sendMessage}
                   className="p-2 bg-conisia-purple text-white rounded-full hover:bg-conisia-pink transition-colors shadow-md"
                >
                   <Send size={18} />
                </button>
             </div>
          </div>
       </GlassCard>
    </div>
  );
};