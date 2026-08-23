import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { Send, Heart, MessageCircle, Share2 } from "lucide-react";

export default function Comunidade() {
  const { posts, addPost, toggleLikePost } = useApp();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostText, setNewPostText] = useState("");

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    addPost(newPostText);
    setNewPostText("");
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "feed") return true;
    return post.tab === activeTab;
  });

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FDF5F8] relative">
      <TopBar title="Fórum da Comunidade" />

      {/* Tabs Menu */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-1.5 shadow-mamae border border-[#F0DDE4] flex">
          {["feed", "seguindo", "recomendados"].map((tab) => {
            const isActive = activeTab === tab;
            const labels = { feed: "Geral", seguindo: "Seguindo", recomendados: "Destaques" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[12px] font-bold rounded-xl transition-all duration-200 uppercase tracking-wide cursor-pointer ${
                  isActive
                    ? "bg-[#D4638F] text-white shadow-sm"
                    : "text-[#8C6B7A] hover:text-[#3D2B33]"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Write New Post Section */}
      <div className="px-5 mt-4">
        <form 
          onSubmit={handlePublish}
          className="bg-white rounded-card p-3 shadow-mamae border border-[#F0DDE4] flex items-center gap-2"
        >
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Pergunte ou compartilhe algo com o fórum..."
            className="flex-1 px-3.5 py-2 bg-[#FBE8EF]/30 border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#D4638F] transition-all font-medium"
            style={{ fontFamily: "Albert Sans" }}
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-2xl bg-[#D4638F] hover:bg-[#B84D75] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-90 transition-all cursor-pointer"
          >
            <Send size={15} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Feed Posts List */}
      <div className="px-5 mt-4 space-y-3.5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4] animate-fadeIn"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4A0B5] flex items-center justify-center text-white font-bold text-[14px] shadow-sm shrink-0 uppercase">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#3D2B33] font-poppins leading-tight">
                    {post.author}
                  </h4>
                  <p className="text-[9.5px] text-[#8C6B7A] font-bold mt-0.5">
                    {post.user}
                  </p>
                </div>
              </div>

              {/* Post Text */}
              <p className="text-[12.5px] leading-relaxed text-[#3D2B33] font-medium" style={{ fontFamily: "Albert Sans" }}>
                {post.text}
              </p>

              {/* Post Actions */}
              <div className="flex items-center gap-5 mt-4 pt-3.5 border-t border-[#F0DDE4]">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold transition-all duration-150 active:scale-90 focus:outline-none cursor-pointer ${
                    post.liked ? "text-[#D4638F]" : "text-[#B8A0AB]"
                  }`}
                >
                  <Heart 
                    size={16} 
                    strokeWidth={2.5} 
                    fill={post.liked ? "#D4638F" : "transparent"} 
                  />
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#B8A0AB] hover:text-[#3D2B33] cursor-pointer">
                  <MessageCircle size={16} strokeWidth={2.5} />
                  <span>{post.comments}</span>
                </button>

                <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#B8A0AB] hover:text-[#3D2B33] cursor-pointer ml-auto">
                  <Share2 size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-card p-6 shadow-mamae border border-[#F0DDE4] text-center">
            <p className="text-[12.5px] text-[#8C6B7A] font-semibold" style={{ fontFamily: "Albert Sans" }}>
              Nenhum post encontrado nesta categoria.
            </p>
            <p className="text-[10px] text-[#8C6B7A]/70 mt-1 font-semibold">
              Inicie um novo assunto escrevendo algo acima!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
