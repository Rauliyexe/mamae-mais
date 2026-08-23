import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { PREGNANCY_DATA } from "../data/mockData";
import { Send, Sparkles, Trash2, Lightbulb } from "lucide-react";

export default function ChatIA() {
  const { user, currentWeek, mood, chatHistory, addChatMessage, clearChatHistory, getDailyTip } = useApp();
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize greeting if chat is empty
  useEffect(() => {
    if (chatHistory.length === 0) {
      let greeting = `Olá ${user.name.split(" ")[0]}! Você está na semana ${currentWeek}. `;
      if (mood) {
        greeting += `Vi que hoje você está se sentindo ${mood}. `;
      }
      greeting += "Como posso te ajudar hoje?";

      addChatMessage({
        id: Date.now(),
        sender: "nina",
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  }, [chatHistory.length, currentWeek, mood, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    addChatMessage(userMsg);
    const inputToMatch = inputText.toLowerCase();
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const keywordsMap = PREGNANCY_DATA.ninaResponses.keywords;
      let matched = false;

      // Check for emergency keywords first
      const emergencies = ["sangramento", "sangue", "liquido amniotico", "bolsa rompeu", "dor forte", "dor intensa"];
      const isEmergency = emergencies.some(kw => inputToMatch.includes(kw));

      for (const pattern in keywordsMap) {
        const regex = new RegExp(pattern, "i");
        if (regex.test(inputToMatch)) {
          replyText = keywordsMap[pattern];
          matched = true;
          break;
        }
      }

      if (!matched) {
        const fallbacks = PREGNANCY_DATA.ninaResponses.fallback;
        replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      const ninaMsg = {
        id: Date.now() + 1,
        sender: "nina",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergency,
      };

      addChatMessage(ninaMsg);
      setIsTyping(false);
    }, 850);
  };

  const dynamicSuggestions = [
    "Dicas de dieta", 
    "Contar chutes", 
    "Preparar a mala", 
    "Sinais de parto"
  ];

  return (
    <div className="w-full h-full flex flex-col font-albert animate-fadeIn relative bg-[#FAF8F5]">
      <TopBar 
        title="Assistente Nina" 
        showBack={true} 
        rightAction={
          <button 
            onClick={clearChatHistory}
            className="text-[#8C6B7A] hover:text-[#C38B9B] active:scale-95 transition-all p-2"
            aria-label="Limpar Conversa"
          >
            <Trash2 size={16} />
          </button>
        }
      />

      {/* Header Info Band */}
      <div className="bg-[#FAF3F6] border-b border-[#F0DDE4] px-5 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C38B9B]/10 flex items-center justify-center text-[#C38B9B] shrink-0 border border-[#F0DDE4]/20">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[#C38B9B] font-poppins flex items-center gap-1">
              Nina AI
              <Sparkles size={11} className="text-[#C38B9B] fill-[#C38B9B] animate-pulse" />
            </h4>
            <p className="text-[10px] text-[#8C6B7A] leading-none font-semibold">Online</p>
          </div>
        </div>
      </div>

      {/* Daily Tip Banner */}
      <div className="mx-4 mt-3 bg-white border border-[#F0DDE4] p-3 rounded-2xl shadow-sm flex items-start gap-3">
        <Lightbulb size={16} className="text-[#C38B9B] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#3D2B33] font-medium leading-relaxed italic">
          {getDailyTip()}
        </p>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin pb-[98px]">
        {chatHistory.map((msg) => {
          const isNina = msg.sender === "nina";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isNina ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm uppercase ${
                  isNina 
                    ? msg.isEmergency ? "bg-[#E53E3E] text-white" : "bg-[#C38B9B] text-white" 
                    : "bg-[#FAF3F6] text-[#4A4743] border border-[#F0DDE4]"
                }`}
              >
                {isNina ? "N" : user.name[0]}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-0.5">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed shadow-sm font-medium ${
                    isNina
                      ? msg.isEmergency 
                        ? "bg-[#FFF5F5] text-[#C53030] border border-[#FC8181] rounded-tl-sm" 
                        : "bg-white text-[#3D2B33] rounded-tl-sm border border-[#F0DDE4]"
                      : "bg-[#C38B9B] text-white rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[8.5px] text-[#8C6B7A] font-bold mt-0.5 ${
                    isNina ? "text-left pl-1" : "text-right pr-1"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[85%] mr-auto animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-[#C38B9B] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              N
            </div>
            <div className="bg-white border border-[#F0DDE4] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="absolute bottom-[58px] left-0 right-0 bg-[#FAF3F6]/85 backdrop-blur-md border-t border-[#F0DDE4] px-3 py-2 flex gap-2 overflow-x-auto scrollbar-thin z-20">
        {dynamicSuggestions.map((q) => (
          <button
            key={q}
            onClick={() => setInputText(q)}
            className="shrink-0 bg-white border border-[#F0DDE4] hover:bg-[#FAF3F6] active:scale-95 text-[#C38B9B] text-[10.5px] font-bold px-3 py-1.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Send Input Form */}
      <form
        onSubmit={handleSend}
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0DDE4] p-2.5 flex items-center gap-2 z-20 shrink-0 shadow-sm"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pergunte sobre sintomas, exames..."
          className="flex-1 px-3.5 py-2.5 bg-[#FAF3F6]/40 border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition-all font-medium"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-2xl bg-[#C38B9B] hover:bg-[#A87483] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-90 transition-all cursor-pointer"
        >
          <Send size={15} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
