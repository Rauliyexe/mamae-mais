import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { 
  Mail, Lock, Globe, MapPin, Bookmark, Download, FileText, 
  ShieldAlert, Info, LogOut, Pencil, Check, X, SmartphoneNfc, 
  Stethoscope, Trash2
} from "lucide-react";

export default function Perfil() {
  const { user, setUser, logout, navigate } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);

  // Modal active option state
  const [activeModal, setActiveModal] = useState(null);

  // Local state for options
  const [tempEmail, setTempEmail] = useState(user.email);
  const [tempLocation, setTempLocation] = useState(user.location || "São Paulo, Brasil");
  const [tempLanguage, setTempLanguage] = useState("Português (BR)");
  const [favoritesCount, setFavoritesCount] = useState(12);
  const [downloadsCount, setDownloadsCount] = useState(3);
  
  // Password change form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMessage, setPassMessage] = useState("");
  
  // Toggles for permissions
  const [perms, setPerms] = useState({
    camera: true,
    location: true,
    notifications: true
  });

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setUser((prev) => ({ ...prev, name: tempName }));
    setIsEditing(false);
  };

  const handleCancelName = () => {
    setTempName(user.name);
    setIsEditing(false);
  };

  const handleSaveEmail = (e) => {
    e.preventDefault();
    if (!tempEmail.trim() || !tempEmail.includes("@")) return;
    setUser((prev) => ({ ...prev, email: tempEmail }));
    setActiveModal(null);
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (!tempLocation.trim()) return;
    setUser((prev) => ({ ...prev, location: tempLocation }));
    setActiveModal(null);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassMessage("Por favor, preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage("A nova senha e a confirmação não conferem.");
      return;
    }
    setPassMessage("Senha atualizada com sucesso!");
    setTimeout(() => {
      setActiveModal(null);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassMessage("");
    }, 1500);
  };

  const options = [
    { id: "portalmedico", label: "Portal do Médico (Acesso Clínico)", Icon: Stethoscope, detail: "Acessar", highlight: true },
    { id: "cartaonfc", label: "Cartão de Emergência NFC", Icon: SmartphoneNfc, detail: "Configurar", highlight: true },
    { id: "email", label: "Email", Icon: Mail, detail: user.email },
    { id: "senha", label: "Senha", Icon: Lock, detail: "••••••••" },
    { id: "idioma", label: "Idioma", Icon: Globe, detail: tempLanguage },
    { id: "localizacao", label: "Localização", Icon: MapPin, detail: tempLocation },
    { id: "favoritos", label: "Favoritos Salvos", Icon: Bookmark, detail: `${favoritesCount} itens` },
    { id: "downloads", label: "Downloads", Icon: Download, detail: `${downloadsCount} PDFs` },
    { id: "termos", label: "Termos e Condições", Icon: FileText },
    { id: "permissoes", label: "Permissões", Icon: ShieldAlert },
    { id: "sobre", label: "Sobre nós", Icon: Info },
  ];

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FAF8F5]">
      <TopBar title="Configurações de Perfil" />

      {/* Avatar Card */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C38B9B] text-white flex items-center justify-center font-bold text-[20px] shadow-sm shrink-0 uppercase">
            {user.name[0]}
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-2.5 py-1 border border-[#C38B9B] rounded-lg text-[13px] text-[#3D2B33] outline-none"
                  style={{ fontFamily: "Albert Sans" }}
                  autoFocus
                />
                <button 
                  onClick={handleSaveName}
                  className="w-7 h-7 rounded-lg bg-[#C38B9B] text-white flex items-center justify-center shrink-0 active:scale-90 cursor-pointer"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={handleCancelName}
                  className="w-7 h-7 rounded-lg bg-[#8C6B7A]/10 text-[#3D2B33] flex items-center justify-center shrink-0 active:scale-90 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-[#4A4743] font-bold text-[15px] font-poppins truncate">
                  {user.name}
                </h3>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-6 h-6 rounded-md bg-[#FAF3F6] hover:bg-[#F0DDE4] flex items-center justify-center text-[#C38B9B] active:scale-90 transition-all shrink-0 cursor-pointer"
                  aria-label="Editar Nome"
                >
                  <Pencil size={11} strokeWidth={2.5} />
                </button>
              </div>
            )}
            <p className="text-[11.5px] text-[#8C6B7A] truncate mt-0.5 font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Options Menu List */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-card shadow-mamae border border-[#F0DDE4] overflow-hidden divide-y divide-[#F0DDE4]">
          {options.map(({ id, label, Icon, detail, highlight }) => (
            <button
              key={label}
              onClick={() => {
                if (id === "cartaonfc") {
                  navigate("cartaonfc");
                } else if (id === "portalmedico") {
                  navigate("portalmedico");
                } else {
                  setActiveModal(id);
                }
              }}
              className={`w-full flex items-center justify-between px-4.5 py-3.5 transition-all duration-200 text-left group cursor-pointer ${
                highlight
                  ? "bg-[#FAF3F6]/55 border-l-4 border-l-[#C38B9B] hover:bg-[#FBE8EF] hover:border-l-[#A87483]"
                  : "hover:bg-[#FAF3F6]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className={`${highlight ? "text-[#C38B9B]" : "text-[#C38B9B]"} group-hover:scale-110 transition-transform duration-200`} strokeWidth={2.3} />
                <span className="text-[12.5px] font-bold text-[#4A4743] group-hover:text-[#2E282A] transition-colors" style={{ fontFamily: "Albert Sans" }}>
                  {label}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {detail && (
                  <span className="text-[10px] text-[#C38B9B] group-hover:bg-[#C38B9B] group-hover:text-white font-extrabold bg-[#FAF3F6] px-2.5 py-0.5 rounded-lg border border-[#F0DDE4] group-hover:border-[#C38B9B] transition-all duration-200">
                    {detail}
                  </span>
                )}
                <span className="text-[#B8A0AB] group-hover:text-[#C38B9B] group-hover:translate-x-0.5 text-[13px] font-bold transition-all duration-200">›</span>
              </div>
            </button>
          ))}
        </div>

        {/* Logout Action Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 mt-5 py-3.5 rounded-full font-extrabold text-[13.5px] text-[#C38B9B] bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
          style={{ fontFamily: "Albert Sans" }}
        >
          <LogOut size={16} strokeWidth={2.5} />
          Sair do Aplicativo
        </button>
      </div>

      {/* ================= MODAL RENDERING SYSTEM ================= */}
      {activeModal && (
        <div className="fixed inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl border border-[#F0DDE4] flex flex-col gap-4 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#4A4743] font-bold text-[13.5px]">
                {options.find(o => o.id === activeModal)?.label}
              </h3>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  setPassMessage("");
                }} 
                className="text-[#8C6B7A] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Email Edit */}
            {activeModal === "email" && (
              <form onSubmit={handleSaveEmail} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[#3D2B33] text-[11px] font-bold px-1">Novo Endereço de E-mail</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Salvar Alteração
                </button>
              </form>
            )}

            {/* Location Edit */}
            {activeModal === "localizacao" && (
              <form onSubmit={handleSaveLocation} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[#3D2B33] text-[11px] font-bold px-1">Cidade e Estado</label>
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Confirmar Localização
                </button>
              </form>
            )}

            {/* Password Change */}
            {activeModal === "senha" && (
              <form onSubmit={handleSavePassword} className="space-y-3.5">
                {passMessage && (
                  <div className="text-[11px] font-bold text-center p-2 rounded-lg bg-[#FAF3F6] border border-[#F0DDE4]">
                    {passMessage}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-[#3D2B33] text-[11px] font-bold px-1">Senha Atual</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#3D2B33] text-[11px] font-bold px-1">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#3D2B33] text-[11px] font-bold px-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer mt-2"
                >
                  Alterar Senha
                </button>
              </form>
            )}

            {/* Language Selection */}
            {activeModal === "idioma" && (
              <div className="space-y-2">
                {[
                  "Português (BR)",
                  "English (US)",
                  "Español (ES)"
                ].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setTempLanguage(lang);
                      setActiveModal(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                      tempLanguage === lang 
                        ? "bg-[#FAF3F6] border-[#C38B9B] text-[#C38B9B]" 
                        : "border-[#F0DDE4] text-[#4A4743] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}

            {/* Favorites List */}
            {activeModal === "favoritos" && (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {favoritesCount === 0 ? (
                  <p className="text-xs text-[#8C6B7A] text-center py-6">Nenhum favorito salvo.</p>
                ) : (
                  [
                    { id: 1, title: "Alimentação no 2º Trimestre", type: "Nutrição" },
                    { id: 2, title: "Exercícios de Respiração", type: "Preparação" },
                    { id: 3, title: "Guia do Quarto do Bebê", type: "Enxoval" }
                  ].slice(0, favoritesCount).map((fav) => (
                    <div key={fav.id} className="bg-[#FAF3F6]/50 border border-[#F0DDE4] p-3 rounded-2xl flex items-center justify-between gap-2 shadow-3xs">
                      <div>
                        <h4 className="text-[11.5px] font-bold text-[#4A4743] leading-tight">{fav.title}</h4>
                        <span className="text-[9px] text-[#8C6B7A] font-bold uppercase mt-0.5 block">{fav.type}</span>
                      </div>
                      <button 
                        onClick={() => setFavoritesCount(prev => Math.max(0, prev - 1))}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Downloads List */}
            {activeModal === "downloads" && (
              <div className="space-y-2.5">
                {[
                  { title: "Guia de Parto Saudável.pdf", size: "1.4 MB" },
                  { title: "Vacinação Gestante.pdf", size: "0.8 MB" },
                  { title: "Diário de Nutrientes.pdf", size: "2.1 MB" }
                ].slice(0, downloadsCount).map((pdf, idx) => (
                  <div key={idx} className="bg-[#FAF3F6]/50 border border-[#F0DDE4] p-3 rounded-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-[#C38B9B]" />
                      <div>
                        <h4 className="text-[11px] font-bold text-[#4A4743] leading-tight truncate max-w-[170px]">{pdf.title}</h4>
                        <span className="text-[9px] text-[#8C6B7A] font-semibold">{pdf.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Simulando abertura do arquivo ${pdf.title}`)}
                      className="text-[9.5px] font-bold text-white bg-[#C38B9B] hover:bg-[#A87483] px-2.5 py-1 rounded-lg"
                    >
                      Abrir
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Terms and Conditions */}
            {activeModal === "termos" && (
              <div className="bg-[#FAF3F6]/50 border border-[#F0DDE4] rounded-2xl p-3.5 max-h-[250px] overflow-y-auto text-[10px] text-[#8C6B7A] leading-relaxed space-y-2 font-medium scrollbar-thin">
                <p className="font-bold text-[#4A4743]">1. Termos de Uso do PWA Mamãe+</p>
                <p>O presente aplicativo tem caráter informativo e de auxílio no monitoramento gestacional. Ele não substitui consultas de pré-natal, diagnósticos ou exames laboratoriais recomendados pelo seu obstetra.</p>
                <p className="font-bold text-[#4A4743]">2. Privacidade de Dados</p>
                <p>Todos os registros de diário, humor, chutes e laudos médicos são armazenados localmente e criptografados no dispositivo, sendo compartilhados exclusivamente com o médico parceiro por meio de conexão autorizada.</p>
                <p className="font-bold text-[#4A4743]">3. Consentimento Clínico</p>
                <p>Ao realizar o upload de exames, você declara-se ciente de que as orientações médicas inseridas pelo portal parceiro são baseadas nas informações fornecidas.</p>
              </div>
            )}

            {/* Permissions */}
            {activeModal === "permissoes" && (
              <div className="space-y-3">
                {[
                  { key: "camera", title: "Acesso à Câmera", desc: "Necessário para tirar fotos dos exames clínicos." },
                  { key: "location", title: "Geolocalização", desc: "Usado para mapear hospitais de emergência próximos." },
                  { key: "notifications", title: "Notificações Push", desc: "Avisos de lembrete de água, diário e retornos médicos." }
                ].map((p) => (
                  <div key={p.key} className="flex items-center justify-between gap-3 p-3 bg-[#FAF3F6]/50 border border-[#F0DDE4] rounded-2xl">
                    <div className="min-w-0">
                      <h4 className="text-[11.5px] font-bold text-[#4A4743]">{p.title}</h4>
                      <p className="text-[9.5px] text-[#8C6B7A] mt-0.5 leading-snug">{p.desc}</p>
                    </div>
                    <button
                      onClick={() => setPerms(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        perms[p.key] ? "bg-[#C38B9B] justify-end" : "bg-[#E5E1DB] justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* About us */}
            {activeModal === "sobre" && (
              <div className="space-y-3 text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF3F6] border border-[#F0DDE4] flex items-center justify-center mx-auto text-xl text-[#C38B9B]">
                  <Heart size={24} className="fill-[#C38B9B]/20" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#4A4743] font-poppins">Mamãe+ PWA Companion</h4>
                  <p className="text-[9px] text-[#8C6B7A] mt-0.5">Versão 2.1.0 Nórdica</p>
                </div>
                <p className="text-[10px] text-[#8C6B7A] leading-relaxed px-1 font-medium italic">
                  "Desenvolvido pela equipe Google Deepmind Advanced Agentic Coding para guiar gestantes com total segurança clínica, cuidado interativo e estética premium."
                </p>
              </div>
            )}

            {/* Close modal action button */}
            <button
              onClick={() => {
                setActiveModal(null);
                setPassMessage("");
              }}
              className="w-full bg-[#FAF3F6] hover:bg-[#FAF3F6]/80 text-[#4A4743] font-bold text-xs py-2.5 rounded-xl border border-[#F0DDE4] cursor-pointer mt-1"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
