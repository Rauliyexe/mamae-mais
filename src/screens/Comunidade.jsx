import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { 
  Send, Heart, MessageCircle, Share2, Bookmark, BookmarkCheck, 
  Search, Plus, Sparkles, ShieldCheck, Lock, UserCheck, CheckCircle2,
  Trash2, X, Filter, Tag, MessageSquare, AlertCircle, Smile
} from "lucide-react";

export default function Comunidade() {
  const { 
    posts = [], 
    addPost, 
    toggleLikePost, 
    toggleSavePost, 
    addCommentToPost, 
    deletePost,
    user,
    userRole,
    doctorUser,
    currentWeek
  } = useApp();

  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "recomendados" | "salvos"
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  // Modals & Forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // New Post Form State
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("clinica");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState(["#Gestacao"]);

  const categories = [
    { id: "todos", label: "Todos", icon: Sparkles },
    { id: "clinica", label: "Dúvidas Clínicas", icon: ShieldCheck, color: "#D4638F" },
    { id: "nutricao", label: "Alimentação & Saúde", icon: Smile, color: "#689F38" },
    { id: "apoio", label: "Desabafos & Emoções", icon: Heart, color: "#E91E63" },
    { id: "enxoval", label: "Chá de Bebê & Nomes", icon: Tag, color: "#8E24AA" },
  ];

  const availableTags = [
    "#1ºTrimestre", "#2ºTrimestre", "#3ºTrimestre", 
    "#Enjoos", "#MovimentoFetal", "#Ultrassom", 
    "#Parto", "#Amamentacao", "#Enxoval", "#Nomes"
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Posts Logic
  const filteredPosts = useMemo(() => {
    const safePosts = Array.isArray(posts) ? posts : [];

    return safePosts.filter((post) => {
      // 1. Tab filtering
      if (activeTab === "recomendados") {
        if (!post.isDoctor && post.tab !== "recomendados" && (post.likes || 0) < 15) return false;
      } else if (activeTab === "salvos") {
        if (!post.saved) return false;
      }

      // 2. Category filtering
      if (selectedCategory !== "todos" && post.category !== selectedCategory) {
        return false;
      }

      // 3. Tag filtering
      if (activeTag && (!post.tags || !post.tags.includes(activeTag))) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = post.text?.toLowerCase().includes(q);
        const matchesAuthor = post.author?.toLowerCase().includes(q);
        const matchesTag = post.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesText && !matchesAuthor && !matchesTag) return false;
      }

      return true;
    });
  }, [posts, activeTab, selectedCategory, activeTag, searchQuery]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const catObj = categories.find((c) => c.id === postCategory);
    addPost({
      text: postContent.trim(),
      category: postCategory,
      categoryLabel: catObj ? catObj.label : "Dúvidas Gerais",
      isAnonymous,
      tags: selectedTags.length > 0 ? selectedTags : ["#Mamãe+"],
    });

    setPostContent("");
    setIsAnonymous(false);
    setSelectedTags(["#Gestacao"]);
    setShowCreateModal(false);
    showToast("Publicação compartilhada com a comunidade!");
  };

  const handleAddComment = (postId) => {
    if (!newCommentText.trim()) return;
    addCommentToPost(postId, newCommentText.trim());
    setNewCommentText("");
    showToast("Resposta adicionada com sucesso!");
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: "Mamãe+ Comunidade",
        text: `"${post.text.slice(0, 100)}..." compartilhado por ${post.author}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(post.text);
      showToast("Texto do post copiado para a área de transferência!");
    }
  };

  const toggleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const currentCommentPost = posts.find((p) => p.id === activeCommentPostId);

  return (
    <div className="w-full min-h-full pb-16 font-albert animate-fadeIn bg-[#FDF5F8] relative select-none">
      <TopBar title="Fórum da Comunidade" />

      {/* Floating Action Button (New Post) */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4638F] to-[#C38B9B] text-white shadow-[0_8px_25px_rgba(212,99,143,0.35)] flex items-center justify-center z-40 active:scale-90 transition-all hover:scale-105 cursor-pointer"
        aria-label="Nova Publicação"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Top Search & Highlights Banner */}
      <div className="px-5 -mt-3 relative z-10 space-y-3">
        {/* Search Input Bar */}
        <div className="bg-white rounded-2xl p-2 px-3 shadow-mamae border border-[#F0DDE4] flex items-center gap-2.5">
          <Search size={17} className="text-[#8C6B7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por assunto, sintomas ou médico..."
            className="flex-1 bg-transparent text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/60 outline-none font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="w-5 h-5 rounded-full bg-[#FAF3F6] text-[#8C6B7A] flex items-center justify-center cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1 shadow-mamae border border-[#F0DDE4] flex">
          {[
            { id: "feed", label: "Explorar" },
            { id: "recomendados", label: "Destaques Médicos ⭐" },
            { id: "salvos", label: "Salvos 🔖" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-[11.5px] font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#D4638F] text-white shadow-sm"
                    : "text-[#8C6B7A] hover:text-[#3D2B33]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category Horizontal Pill Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTag(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-[#3D2B33] text-white border-[#3D2B33] shadow-sm"
                    : "bg-white text-[#8C6B7A] border-[#F0DDE4] hover:bg-[#FAF3F6]"
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tag Filter Indicator */}
        {activeTag && (
          <div className="flex items-center gap-2 bg-[#FBE8EF] border border-[#F0DDE4] rounded-xl px-3 py-1.5 animate-fadeIn">
            <span className="text-[11px] font-bold text-[#D4638F] flex-1">
              Filtrando por tag: <b>{activeTag}</b>
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className="text-[#D4638F] hover:text-[#3D2B33] text-[10.5px] font-bold cursor-pointer"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Posts Feed Section */}
      <div className="px-5 mt-4 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isSaved = !!post.saved;
            const isLiked = !!post.liked;
            const commentsCount = Array.isArray(post.comments) ? post.comments.length : (post.comments || 0);

            return (
              <div 
                key={post.id} 
                className="bg-white rounded-[24px] p-4.5 shadow-mamae border border-[#F0DDE4] animate-fadeIn transition-all hover:shadow-md"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[14px] shadow-sm shrink-0 uppercase ${
                      post.isAnonymous 
                        ? "bg-[#4A4743] text-white" 
                        : post.isDoctor 
                          ? "bg-gradient-to-tr from-[#1976D2] to-[#42A5F5] text-white" 
                          : "bg-gradient-to-tr from-[#D4638F] to-[#C38B9B] text-white"
                    }`}>
                      {post.avatar || "M"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-[13px] font-bold text-[#3D2B33] font-poppins leading-tight truncate">
                          {post.author}
                        </h4>
                        {post.isDoctor && (
                          <span className="bg-[#E3F2FD] text-[#1976D2] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <ShieldCheck size={10} /> Médico Verificado
                          </span>
                        )}
                        {post.isAnonymous && (
                          <span className="bg-[#F5F5F5] text-[#616161] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Lock size={9} /> Anônima
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8C6B7A] font-semibold mt-0.5 truncate">
                        {post.badge || post.user} · {post.timeAgo || "recente"}
                      </p>
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  {post.categoryLabel && (
                    <span className="text-[9.5px] font-bold px-2.5 py-1 rounded-full bg-[#FAF3F6] text-[#D4638F] border border-[#F0DDE4] shrink-0">
                      {post.categoryLabel}
                    </span>
                  )}
                </div>

                {/* Post Text */}
                <p className="text-[13px] leading-relaxed text-[#3D2B33] font-medium whitespace-pre-line">
                  {post.text}
                </p>

                {/* Post Tags */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTag(activeTag === t ? null : t)}
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                          activeTag === t
                            ? "bg-[#D4638F] text-white"
                            : "bg-[#FBE8EF]/60 text-[#D4638F] hover:bg-[#FBE8EF]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Doctor Highlight Feedback preview if present */}
                {Array.isArray(post.comments) && post.comments.some((c) => c.isDoctor) && (
                  <div className="mt-3 bg-[#EBF5FB] border border-[#BBDEFB] rounded-2xl p-3 flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#1976D2] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#1976D2] uppercase tracking-wider">
                        Resposta Médica em Destaque
                      </p>
                      <p className="text-[11.5px] text-[#2C3E50] font-medium mt-0.5 line-clamp-2">
                        {post.comments.find((c) => c.isDoctor)?.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Post Action Buttons */}
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#F0DDE4]">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-[11.5px] font-bold transition-all duration-150 active:scale-90 cursor-pointer ${
                        isLiked ? "text-[#D4638F]" : "text-[#8C6B7A] hover:text-[#D4638F]"
                      }`}
                    >
                      <Heart 
                        size={17} 
                        strokeWidth={2.5} 
                        fill={isLiked ? "#D4638F" : "transparent"} 
                        className={isLiked ? "scale-110" : ""}
                      />
                      <span>{post.likes || 0}</span>
                    </button>

                    {/* Comments Discussion Button */}
                    <button 
                      onClick={() => setActiveCommentPostId(post.id)}
                      className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#8C6B7A] hover:text-[#3D2B33] active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle size={17} strokeWidth={2.2} />
                      <span>{commentsCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Bookmark Save Button */}
                    <button
                      onClick={() => {
                        toggleSavePost(post.id);
                        showToast(isSaved ? "Removido dos salvos." : "Post salvo com sucesso!");
                      }}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? "text-[#D4638F] bg-[#FBE8EF]" : "text-[#8C6B7A] hover:bg-[#FAF3F6]"
                      }`}
                      title={isSaved ? "Salvo" : "Salvar"}
                    >
                      {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                    </button>

                    {/* Share Button */}
                    <button 
                      onClick={() => handleShare(post)}
                      className="p-1.5 rounded-xl text-[#8C6B7A] hover:bg-[#FAF3F6] active:scale-95 transition-colors cursor-pointer"
                      title="Compartilhar"
                    >
                      <Share2 size={16} />
                    </button>

                    {/* Delete button (if user created it) */}
                    {(post.author === user?.name || post.user === "@anonima") && (
                      <button
                        onClick={() => {
                          deletePost(post.id);
                          showToast("Publicação removida.");
                        }}
                        className="p-1.5 rounded-xl text-[#8C6B7A]/60 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[28px] p-8 shadow-mamae border border-[#F0DDE4] text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF3F6] text-[#D4638F] flex items-center justify-center mx-auto shadow-sm">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#3D2B33] font-poppins">
                Nenhuma publicação encontrada
              </h3>
              <p className="text-[11.5px] text-[#8C6B7A] font-medium mt-1 max-w-xs mx-auto">
                Não há tópicos com esses filtros no momento. Seja a primeira a iniciar a conversa!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab("feed");
                setSelectedCategory("todos");
                setActiveTag(null);
                setSearchQuery("");
                setShowCreateModal(true);
              }}
              className="bg-[#D4638F] hover:bg-[#B84D75] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Criar Nova Publicação
            </button>
          </div>
        )}
      </div>

      {/* ================= NEW POST MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 text-[#3D2B33] shadow-2xl relative border border-[#F0DDE4]">
            <div className="flex justify-between items-center pb-3 border-b border-[#F0DDE4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF3F6] text-[#D4638F] flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-[14px] text-[#3D2B33]">
                    Nova Publicação
                  </h3>
                  <p className="text-[10px] text-[#8C6B7A] font-semibold">
                    Espaço seguro para dúvidas, acolhimento e trocas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF3F6] text-[#8C6B7A] flex items-center justify-center hover:bg-[#F5ECEF] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
              {/* Category Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#3D2B33] block mb-1.5">
                  Categoria do Assunto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.filter(c => c.id !== "todos").map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPostCategory(c.id)}
                      className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        postCategory === c.id
                          ? "bg-[#D4638F] text-white border-[#D4638F] shadow-sm"
                          : "bg-[#FAF3F6]/50 text-[#8C6B7A] border-[#F0DDE4] hover:bg-[#FAF3F6]"
                      }`}
                    >
                      <c.icon size={13} />
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Area */}
              <div>
                <label className="text-[11px] font-bold text-[#3D2B33] block mb-1.5">
                  Sua mensagem ou dúvida
                </label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Escreva aqui com detalhes o que está sentindo, vivenciando ou querendo saber..."
                  className="w-full p-3.5 bg-[#FAF3F6]/40 border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/60 outline-none focus:border-[#D4638F] transition-all resize-none font-medium"
                  required
                />
              </div>

              {/* Tag Picker */}
              <div>
                <label className="text-[11px] font-bold text-[#3D2B33] block mb-1.5">
                  Adicionar Tags (até 3)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-thin">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagSelection(tag)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#3D2B33] text-white border-[#3D2B33]"
                            : "bg-white text-[#8C6B7A] border-[#F0DDE4]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Anonymous Toggle Box */}
              <div className="p-3 bg-[#FAF3F6] rounded-2xl border border-[#F0DDE4] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#4A4743] shadow-sm">
                    <Lock size={14} />
                  </div>
                  <div>
                    <h5 className="text-[11.5px] font-bold text-[#3D2B33]">Postar como Anônima</h5>
                    <p className="text-[9.5px] text-[#8C6B7A]">Seu nome e foto não serão exibidos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    isAnonymous ? "bg-[#D4638F] justify-end" : "bg-[#E5E1DB] justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#D4638F] hover:bg-[#B84D75] text-white font-bold py-3 rounded-2xl transition-all shadow-md active:scale-95 text-xs font-poppins flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} strokeWidth={2.5} />
                Publicar no Fórum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= COMMENTS & DISCUSSION MODAL ================= */}
      {currentCommentPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg max-h-[85vh] h-[85vh] sm:h-auto sm:max-h-[600px] flex flex-col p-5 shadow-2xl border border-[#F0DDE4] relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#F0DDE4] shrink-0">
              <div>
                <h3 className="font-poppins font-bold text-[14px] text-[#3D2B33]">
                  Comentários & Respostas
                </h3>
                <p className="text-[10px] text-[#8C6B7A] font-semibold">
                  Tópico de {currentCommentPost.author}
                </p>
              </div>
              <button
                onClick={() => setActiveCommentPostId(null)}
                className="w-8 h-8 rounded-full bg-[#FAF3F6] text-[#8C6B7A] flex items-center justify-center hover:bg-[#F5ECEF] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Original Post Context Banner */}
            <div className="bg-[#FAF3F6]/60 p-3 rounded-2xl border border-[#F0DDE4] my-3 shrink-0">
              <p className="text-[12px] text-[#3D2B33] font-medium line-clamp-3">
                "{currentCommentPost.text}"
              </p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {Array.isArray(currentCommentPost.comments) && currentCommentPost.comments.length > 0 ? (
                currentCommentPost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-2xl border text-xs ${
                      comment.isDoctor
                        ? "bg-[#EBF5FB] border-[#BBDEFB]"
                        : "bg-[#FAF3F6]/50 border-[#F0DDE4]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#3D2B33]">{comment.author}</span>
                        {comment.isDoctor && (
                          <span className="bg-[#E3F2FD] text-[#1976D2] text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <ShieldCheck size={9} /> Médico
                          </span>
                        )}
                        <span className="text-[9.5px] text-[#8C6B7A] font-medium">
                          · {comment.badge || comment.timeAgo || "recente"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#4A4743] font-medium leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#8C6B7A]">
                  <MessageCircle size={28} className="mx-auto text-[#D4638F]/40 mb-2" />
                  <p className="text-xs font-bold text-[#3D2B33]">Seja a primeira a responder!</p>
                  <p className="text-[10.5px] text-[#8C6B7A] mt-0.5">
                    Compartilhe seu carinho, experiência ou conselho.
                  </p>
                </div>
              )}
            </div>

            {/* Comment Composer Input */}
            <div className="pt-3 border-t border-[#F0DDE4] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(currentCommentPost.id);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Escreva uma resposta acolhedora..."
                  className="flex-1 px-3.5 py-2.5 bg-[#FAF3F6] border border-[#F0DDE4] rounded-2xl text-[12px] text-[#3D2B33] placeholder-[#8C6B7A]/60 outline-none focus:border-[#D4638F] font-medium"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-2xl bg-[#D4638F] hover:bg-[#B84D75] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-90 transition-all cursor-pointer"
                >
                  <Send size={15} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D2B33] text-white px-4 py-2.5 rounded-2xl text-[11.5px] font-bold shadow-xl border border-white/10 z-[120] animate-fadeIn flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#81C784]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
