import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Search, Sparkles, Send, Loader2, Bot, User, Globe, FileText, ArrowRight } from 'lucide-react';
import { askConisia, summarizeFile } from '../services/geminiService';
import { ChatMessage, ChatRole } from '../types';
import { useData } from '../contexts/DataContext';

export const IntelligentSearch: React.FC = () => {
  const { documents, currentUser } = useData(); // Get documents for context
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: "Bonjour ! Je suis l'IA de Conisia. Je peux retrouver des documents et résumer des procédures. Que cherchez-vous ?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // Added loading to dependency to scroll when typing starts

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: ChatRole.USER, text: userMsg }]);

    let responseText = "";
    if (!currentUser) {
      // Mock response for landing page
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      responseText = "Merci d'utiliser Conisia Brain pour vos question !";
    } else {
      // Call Gemini with document context & Web Search option
      responseText = await askConisia(userMsg, documents, false);
    }

    // Add model response
    setMessages(prev => [...prev, { role: ChatRole.MODEL, text: responseText }]);
    setLoading(false);
  };

  const handleSummarize = async (docName: string) => {
      setLoading(true);
      setMessages(prev => [...prev, { role: ChatRole.USER, text: `Peux-tu me résumer le document "${docName}" ?` }]);
      const summary = await summarizeFile(docName, documents);
      setMessages(prev => [...prev, { role: ChatRole.MODEL, text: summary }]);
      setLoading(false);
  }

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const content = line.replace(/^[\*\-]\s/, '');
      const parts = content.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className={`${isBullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-fealty-green' : 'mb-1'}`}>
           {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                 return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
           })}
        </div>
      );
    });
  };

  const TypingIndicator = () => (
      <div className="flex gap-1.5 p-2 items-center h-6">
          <div className="w-2 h-2 rounded-full bg-fealty-green animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-fealty-green animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-fealty-green animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
  );

  return (
    <section className="py-20 px-4 bg-fealty-light relative overflow-hidden" id="ai-search">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-fealty-green/20 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-fealty-dark mb-4">
            Recherche <span className="text-transparent bg-clip-text bg-gradient-to-r from-fealty-green to-emerald-600">Contextuelle</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Posez vos questions sur vos documents. Conisia analyse le contenu en temps réel.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
             <GlassCard className="h-[600px] flex flex-col shadow-2xl border-slate-200 bg-white">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fealty-dark flex items-center justify-center text-fealty-green shadow-lg">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Conisia Brain</h4>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> En ligne
                        </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === ChatRole.USER ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === ChatRole.USER ? 'bg-slate-200' : 'bg-fealty-green text-fealty-dark'}`}>
                        {msg.role === ChatRole.USER ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className="flex flex-col gap-2 max-w-[85%]">
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === ChatRole.USER 
                              ? 'bg-fealty-dark text-white rounded-tr-none' 
                              : 'bg-slate-50 border border-slate-100 rounded-tl-none text-slate-700'
                          }`}>
                            {msg.role === ChatRole.USER ? msg.text : formatText(msg.text)}
                          </div>
                          
                          {/* Suggest Actions for Model Responses */}
                          {msg.role === ChatRole.MODEL && documents.map(doc => {
                              // If response mentions a document name, offer summary
                              if (msg.text.includes(doc.name)) {
                                  return (
                                      <button 
                                        key={doc.id}
                                        onClick={() => handleSummarize(doc.name)}
                                        className="self-start flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-fealty-dark hover:border-fealty-green transition-colors shadow-sm"
                                      >
                                          <FileText size={14} className="text-fealty-green" />
                                          Résumer "{doc.name}"
                                      </button>
                                  )
                              }
                              return null;
                          })}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 animate-fade-in">
                       <div className="w-8 h-8 rounded-full bg-fealty-green text-fealty-dark flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-slate-50 border border-slate-100 shadow-sm rounded-2xl rounded-tl-none p-3 flex items-center">
                         <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white/80 border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Posez une question sur vos documents..."
                      className="w-full pl-6 pr-14 py-4 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-fealty-green transition-all shadow-inner text-slate-800 placeholder:text-slate-400"
                    />
                    <button 
                      onClick={handleSearch}
                      disabled={loading || !query.trim()}
                      className="absolute right-2 top-2 p-2 bg-fealty-dark text-white rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50 hover:scale-105 active:scale-95 transform duration-200"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
             </GlassCard>
          </div>

          <div className="lg:col-span-2 space-y-6 pt-8">
            <h3 className="text-xl font-bold text-slate-800">Contexte Actuel :</h3>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4">
                  {currentUser ? "Documents indexés" : "exemple de document indexés"}
                </p>
                <div className="flex flex-wrap gap-2">
                    {currentUser ? (
                      <>
                        {documents.slice(0, 5).map(d => (
                            <span key={d.id} className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600 truncate max-w-[150px]">
                                {d.name}
                            </span>
                        ))}
                        {documents.length > 5 && <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-400">+{documents.length - 5} autres</span>}
                        {documents.length === 0 && <span className="text-xs text-slate-400 italic">Aucun document chargé</span>}
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600 truncate max-w-[150px]">stratégie marketing</span>
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600 truncate max-w-[150px]">plan commercial</span>
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600 truncate max-w-[150px]">projet client</span>
                      </>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                    <p className="text-sm text-slate-500">
                        Mode Interne : L'IA répond uniquement en se basant sur vos documents privés et ses connaissances générales.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
