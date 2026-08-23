import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { PREGNANCY_DATA } from "../data/mockData";
import { Search, Clock, X } from "lucide-react";

export default function Receitas() {
  const { goBack } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = ["Todas", "Café da manhã", "Lanches", "Almoço/Jantar", "Dicas"];

  const filteredRecipes = PREGNANCY_DATA.receitas.filter((recipe) => {
    const matchesCategory = activeCategory === "Todas" || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                          recipe.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FDF5F8] relative">
      <TopBar title="Nutrição e Alimentação" showBack={true} />

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="absolute inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-[340px] max-h-[700px] overflow-y-auto p-5 shadow-2xl flex flex-col scrollbar-none border border-[#F0DDE4]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-bold text-[#D4638F] bg-[#FBE8EF] px-2.5 py-0.5 rounded-full uppercase border border-[#D4A0B5]/10">
                {selectedRecipe.category}
              </span>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="text-[#8C6B7A] hover:text-[#3D2B33] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="font-poppins text-[#3D2B33] font-bold text-[15.5px] leading-tight mb-3">
              {selectedRecipe.title}
            </h3>

            <div 
              className="h-[120px] rounded-2xl mb-4 border border-[#F0DDE4]" 
              style={{ backgroundColor: selectedRecipe.imageColor }}
            />

            <p className="text-[12px] text-[#8C6B7A] leading-relaxed mb-4 italic font-medium">
              "{selectedRecipe.desc}"
            </p>

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-poppins text-[13px] font-bold text-[#6B2D4E] mb-1.5 flex items-center gap-1.5">
                🥦 Ingredientes
              </h4>
              <ul className="list-disc pl-5 text-[11.5px] text-[#3D2B33] space-y-1 font-medium">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Preparation */}
            <div className="mb-4">
              <h4 className="font-poppins text-[13px] font-bold text-[#6B2D4E] mb-1.5 flex items-center gap-1.5">
                🥣 Modo de Preparo
              </h4>
              <p className="text-[11.5px] text-[#3D2B33] leading-relaxed font-medium">
                {selectedRecipe.prep}
              </p>
            </div>

            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-full bg-[#D4638F] hover:bg-[#B84D75] text-white font-extrabold text-[13px] py-3.5 rounded-full mt-2 transition-all duration-150 active:scale-95 shadow-md cursor-pointer"
            >
              Fechar Receita
            </button>
          </div>
        </div>
      )}

      {/* Search Bar Input */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-2.5 shadow-mamae border border-[#F0DDE4] flex items-center gap-2">
          <Search size={18} className="text-[#8C6B7A] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar receitas saudáveis..."
            className="flex-1 text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none pr-2 bg-transparent font-medium"
          />
        </div>
      </div>

      {/* Category Pills Menu */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#D4638F] text-white shadow-sm font-extrabold"
                    : "bg-white text-[#8C6B7A] border border-[#F0DDE4]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Grid List */}
      <div className="px-5 mt-4">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecipe(r)}
                className="bg-white rounded-card overflow-hidden shadow-mamae border border-[#F0DDE4] cursor-pointer group hover:shadow-md transition-all duration-200"
              >
                <div 
                  className="h-[95px] w-full relative transition-transform group-hover:scale-[1.03] border-b border-[#F0DDE4]" 
                  style={{ backgroundColor: r.imageColor }}
                >
                  <span className="absolute bottom-2 left-2 text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#D4638F] uppercase border border-[#D4A0B5]/10">
                    {r.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-[12px] font-bold text-[#3D2B33] font-poppins leading-snug line-clamp-2 h-8">
                    {r.title}
                  </h4>
                  <p className="text-[9.5px] text-[#D4638F] mt-1.5 flex items-center gap-1 font-bold">
                    <Clock size={10} /> Ver modo de preparo
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card p-6 shadow-mamae border border-[#F0DDE4] text-center">
            <p className="text-[12.5px] text-[#8C6B7A] font-semibold" style={{ fontFamily: "Albert Sans" }}>
              Nenhuma receita encontrada.
            </p>
            <p className="text-[10px] text-[#8C6B7A]/70 mt-1 font-semibold">
              Tente reescrever a busca ou trocar de categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
