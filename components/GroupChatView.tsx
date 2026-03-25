import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Paperclip, MoreVertical, Search, Phone, Video, Users, ArrowLeft } from 'lucide-react';
import { GroupMessage } from '../types';

interface GroupChatViewProps {
  onBack: () => void;
  groupName?: string;
}

export const GroupChatView: React.FC<GroupChatViewProps> = ({ onBack, groupName = "Discussion Groupe" }) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const newMsg: GroupMessage = {
      id: Date.now().toString(),
      sender: 'Moi',
      avatar: '',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInputValue('');
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
             <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={16} /> Membres</h4>
             <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                Vous êtes le seul membre
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
             {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                   {!msg.isMe && <img src={msg.avatar} className="w-8 h-8 rounded-full mt-auto mb-1" alt={msg.sender} />}
                   <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      {!msg.isMe && <span className="text-xs text-slate-500 mb-1 ml-1">{msg.sender}</span>}
                      <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                         msg.isMe 
                         ? 'bg-conisia-purple text-white rounded-tr-sm' 
                         : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                      }`}>
                         {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.timestamp}</span>
                   </div>
                </div>
             ))}
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