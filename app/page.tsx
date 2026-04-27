'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Loader2, User, Bot, AlertCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlertProps {
  message: string;
}

function ErrorAlert({ message }: AlertProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 max-w-2xl mx-auto"
    >
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function HistoryChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '¡Saludos, joven erudito! Bienvenido al túnel del tiempo. Soy tu mentor y guía histórico. ¿Qué fascinante época o civilización de la Historia Universal te gustaría explorar hoy?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const historySnapshot = [...messages, userMessage];
    
    setMessages(historySnapshot);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historySnapshot }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fallo en la comunicación con el archivo histórico.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err: any) {
      setError(err.message || 'Interferencias en la red temporalmente... No se pudieron recuperar los registros históricos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0c] text-slate-100 font-sans relative p-6 gap-6">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="shrink-0 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-between px-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">El Túnel del Tiempo</h1>
            <p className="text-xs text-blue-400 font-medium">Archivos Históricos interactivos</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[10px] py-1 px-3 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono">NEXT_JS_APP_ROUTER</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold text-[10px]">En línea</span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {error && <ErrorAlert message={error} />}

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${
                    isAssistant 
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/20 text-white' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isAssistant ? <span className="text-[10px] font-bold">AI</span> : <span className="text-[10px] font-bold">ME</span>}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    isAssistant 
                      ? 'bg-white/5 border border-white/10 rounded-tl-none text-slate-200' 
                      : 'bg-blue-600/20 border border-blue-500/30 rounded-tr-none text-slate-100'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex gap-4"
             >
               <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/20 text-white">
                 <span className="text-[10px] font-bold">AI</span>
               </div>
               <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                 <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 </div>
                 <span className="text-xs text-slate-400 italic ml-1">Buscando en los registros históricos...</span>
               </div>
             </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-4"
          >
            <button
              type="button"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors border border-white/10 hidden sm:block"
            >
              <History className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consulta al Profesor de Historia..."
              disabled={loading}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-slate-500 px-2 text-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-500 text-white"
            >
              Enviar
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-slate-500 font-medium">
              La IA puede cometer errores. Por favor, verifica de vez en cuando las fuentes históricas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
