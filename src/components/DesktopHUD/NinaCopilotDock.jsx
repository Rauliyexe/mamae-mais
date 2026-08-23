import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { MockAPI } from "../../data/mockApi";
import { 
  Sparkles, Send, Bot, User, RefreshCw, Volume2, 
  ChevronRight, ChevronLeft, MessageSquare, Lightbulb 
} from "lucide-react";

export default function NinaCopilotDock({ isCollapsed, onToggleCollapse }) {
  const { chatHistory, addChatMessage, currentWeek, user } = useApp();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultSuggestions = [
    `Marcos da semana ${currentWeek}`,
    "Como aliviar azia e enjoo?",
    "Alimentos recomendados agora",
    "Exames do 2º trimestre",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addChatMessage(userMsg);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const responseText = await MockAPI.askAI(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addChatMessage(aiMsg);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Desculpe, tive uma oscilação na conexão. Pode repetir sua pergunta?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addChatMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  if (isCollapsed) {
    return (
      <aside className="w-12 bg-white border-l border-[#F0DDE4] flex flex-col items-center py-4 justify-between shrink-0 shadow-sm">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-xl bg-[#FBE8EF] text-[#D4638F] hover:bg-[#F2D0DE] flex items-center justify-center transition-colors cursor-pointer"
          title="Expandir Nina Copilot"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4638F] to-[#F28EB5] flex items-center justify-center text-white text-xs shadow-sm font-bold animate-bounce">
            ✨
          </div>
          <span className="text-[10px] font-bold text-[#8C6B7A] [writing-mode:vertical-rl] tracking-widest uppercase font-poppins">
            NINA COPILOT IA
          </span>
        </div>

        <div className="w-2 h-2 rounded-full bg-[#48BB78]" title="IA Online" />
      </aside>
    );
  }

  return (
    <aside className="w-[340px] xl:w-[380px] bg-white border-l border-[#F0DDE4] flex flex-col justify-between shrink-0 shadow-sm font-albert h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#F0DDE4] bg-[#FDF5F8]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F28EB5] to-[#D4638F] flex items-center justify-center text-white shadow-sm font-bold">
              <Bot size={18} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#48BB78] border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#6B2D4E] font-poppins">Nina Copilot IA</h3>
              <span className="text-[9px] font-extrabold bg-[#FBE8EF] text-[#D4638F] px-1.5 py-0.2 rounded-md uppercase">24h</span>
            </div>
            <p className="text-[10.5px] text-[#8C6B7A]">Assistente obstétrica contextual</p>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg text-[#8C6B7A] hover:bg-[#FBE8EF] hover:text-[#6B2D4E] flex items-center justify-center transition-colors cursor-pointer"
          title="Recolher painel"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Quick Suggestions Carousel */}
      <div className="px-3.5 py-2.5 bg-[#FFF9FB] border-b border-[#F0DDE4] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <Lightbulb size={12} className="text-[#D4638F] shrink-0" />
        {defaultSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="text-[10.5px] font-bold text-[#6B2D4E] bg-white hover:bg-[#FBE8EF] border border-[#F0DDE4] px-2.5 py-1 rounded-xl whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF3F6]/50 scrollbar-thin">
        {/* Welcome Message if chat empty */}
        {chatHistory.length === 0 && (
          <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-2xs text-xs text-[#523A46] leading-relaxed">
            <p className="font-bold text-[#6B2D4E] font-poppins mb-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#D4638F]" /> Olá, {user.name.split(" ")[0]}!
            </p>
            Estou conectada ao seu Centro de Operações. Posso tirar dúvidas sobre a sua <b>{currentWeek}ª semana</b>, analisar sintomas ou sugerir cuidados para hoje.
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                msg.sender === "user"
                  ? "bg-[#D4638F] text-white rounded-br-none"
                  : "bg-white text-[#3D2B33] border border-[#F0DDE4] rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9.5px] text-[#8C6B7A] px-1 mt-0.5">
              {msg.timestamp || "agora"}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-[#F0DDE4] w-20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4638F] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4638F] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4638F] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Input Box */}
      <div className="p-3 bg-white border-t border-[#F0DDE4]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 bg-[#FDF5F8] p-1.5 rounded-2xl border border-[#F0DDE4] focus-within:border-[#D4638F]"
        >
          <input
            type="text"
            placeholder="Pergunte à Nina sobre a gestação..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[#3D2B33] placeholder-[#8C6B7A] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-xl bg-[#D4638F] hover:bg-[#B84E77] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-sm shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </aside>
  );
}
