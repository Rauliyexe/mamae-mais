import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/TopBar";
import { MockAPI } from "../../data/mockApi";
import { CreditCard, SmartphoneNfc, CheckCircle2, AlertCircle, Edit, Trash2, Info, Loader2 } from "lucide-react";

export default function CartaoNFC() {
  const { user, navigate } = useApp();
  
  const [bindingStatus, setBindingStatus] = useState("loading"); // loading, none, scanning, bound
  const [cardData, setCardData] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState(null);

  // Hardcoded ID for the simulation
  const SIMULATED_USER_ID = "user_123";

  useEffect(() => {
    loadBinding();
  }, []);

  const loadBinding = async () => {
    setBindingStatus("loading");
    try {
      const binding = await MockAPI.getCardBinding(SIMULATED_USER_ID);
      if (binding) {
        setCardData(binding);
        setBindingStatus("bound");
      } else {
        setBindingStatus("none");
      }
    } catch (err) {
      setError("Erro ao carregar dados do cartão.");
      setBindingStatus("none");
    }
  };

  const handleStartScan = async () => {
    setError(null);
    setBindingStatus("scanning");

    // Web NFC API integration
    if ('NDEFReader' in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        
        ndef.addEventListener("reading", async ({ message, serialNumber }) => {
          // If the card has a serial number, use it. In a real app, 
          // we would read a specific NDEF record or use the hardware serial.
          const cardId = serialNumber || `nfc_${Date.now()}`;
          await processBinding(cardId);
        });

        ndef.addEventListener("readingerror", () => {
          setError("Erro de leitura. Tente aproximar o cartão novamente.");
          setBindingStatus("none");
        });

      } catch (error) {
        console.warn("Web NFC API falhou:", error);
        // Fallback to manual UI if permission denied or other error
      }
    } else {
      console.warn("Web NFC não suportado neste navegador (ex: iOS Safari).");
      // UI will automatically show the manual fallback since it stays in 'scanning'
    }
  };

  const processBinding = async (cardId) => {
    try {
      setBindingStatus("loading");
      const result = await MockAPI.bindNFCCard(SIMULATED_USER_ID, cardId);
      setCardData({ cardId, linkedAt: result.linkedAt });
      setBindingStatus("bound");
    } catch (err) {
      setError(err.message || "Erro ao vincular cartão.");
      setBindingStatus("none");
    }
  };

  const handleManualBind = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processBinding(manualInput.trim());
  };

  const handleUnbind = async () => {
    if (!confirm("Tem certeza que deseja desvincular este cartão de emergência?")) return;
    
    setBindingStatus("loading");
    try {
      await MockAPI.unbindNFCCard(SIMULATED_USER_ID);
      setCardData(null);
      setBindingStatus("none");
    } catch (err) {
      setError("Erro ao desvincular cartão.");
      setBindingStatus("bound");
    }
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FDF5F8] relative">
      <TopBar title="Cartão NFC" showBack={true} />

      <div className="px-5 -mt-4 relative z-10">
        
        {error && (
          <div className="bg-[#FFF5F5] border border-[#FEB2B2] p-3 rounded-xl mb-4 flex items-start gap-2 text-[#C53030]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[12px] font-medium">{error}</p>
          </div>
        )}

        {bindingStatus === "loading" && (
          <div className="bg-white rounded-card p-8 shadow-mamae border border-[#F0DDE4] flex flex-col items-center justify-center min-h-[250px]">
            <Loader2 size={32} className="text-[#D4638F] animate-spin mb-4" />
            <p className="text-[#8C6B7A] font-bold text-[13px]">Carregando dados...</p>
          </div>
        )}

        {/* STATE: NO CARD BOUND */}
        {bindingStatus === "none" && (
          <div className="bg-white rounded-card p-5 shadow-mamae border border-[#F0DDE4] text-center">
            <div className="w-16 h-16 rounded-full bg-[#FBE8EF] mx-auto flex items-center justify-center text-[#D4638F] mb-4">
              <CreditCard size={32} />
            </div>
            <h2 className="text-[#3D2B33] font-bold text-[16px] font-poppins mb-2">
              Cartão de Emergência
            </h2>
            <p className="text-[#8C6B7A] text-[12px] leading-relaxed mb-6 font-medium">
              Vincule um cartão físico Mamãe+ à sua conta. Em caso de emergência, socorristas poderão encostar o celular no cartão para acessar seus dados vitais instantaneamente, mesmo se você estiver sem o seu celular.
            </p>
            
            <button
              onClick={handleStartScan}
              className="w-full bg-[#D4638F] hover:bg-[#B84D75] text-white font-extrabold text-[13px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <SmartphoneNfc size={18} />
              Vincular Meu Cartão
            </button>
          </div>
        )}

        {/* STATE: SCANNING / BINDING */}
        {bindingStatus === "scanning" && (
          <div className="bg-white rounded-card p-5 shadow-mamae border border-[#F0DDE4] text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-[#FBE8EF] rounded-full animate-ping opacity-75" />
              <div className="relative w-full h-full bg-[#FBE8EF] rounded-full flex items-center justify-center text-[#D4638F] shadow-sm z-10">
                <SmartphoneNfc size={36} />
              </div>
            </div>
            <h2 className="text-[#3D2B33] font-bold text-[15px] font-poppins mb-2">
              Aproxime o cartão
            </h2>
            <p className="text-[#8C6B7A] text-[12px] leading-relaxed mb-6 font-medium">
              Encoste o cartão Mamãe+ na parte de trás do seu celular para vinculá-lo.
            </p>

            {/* Fallback for iOS / No NFC */}
            <div className="mt-6 border-t border-[#F0DDE4] pt-4 text-left">
              <p className="text-[#8C6B7A] text-[11px] mb-3 flex items-center gap-1 font-bold">
                <Info size={14} /> Seu celular não lê NFC? Digite o código:
              </p>
              <form onSubmit={handleManualBind} className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Ex: MM-12345"
                  className="flex-1 px-3 py-2.5 border border-[#F0DDE4] rounded-xl text-[12.5px] text-[#3D2B33] outline-none font-medium bg-[#FBE8EF]/20 focus:border-[#D4638F]"
                />
                <button
                  type="submit"
                  className="bg-[#3D2B33] text-white px-4 py-2.5 rounded-xl text-[12px] font-bold"
                >
                  Vincular
                </button>
              </form>
            </div>
            
            <button
              onClick={() => setBindingStatus("none")}
              className="mt-6 text-[12px] font-bold text-[#8C6B7A] underline"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* STATE: BOUND */}
        {bindingStatus === "bound" && cardData && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#D4638F] to-[#B84D75] rounded-card p-5 shadow-[0_8px_20px_rgba(212,99,143,0.3)] text-white relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/10 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-[#FBE8EF]" />
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-[#FBE8EF]">
                      Cartão Ativo
                    </span>
                  </div>
                  <SmartphoneNfc size={24} className="opacity-80" />
                </div>
                
                <p className="text-[10px] text-white/70 font-bold uppercase mb-0.5">Gestante</p>
                <p className="font-poppins text-[18px] font-bold mb-4">{user.name}</p>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-white/70 font-bold uppercase mb-0.5">ID Público</p>
                    <p className="font-mono text-[11px] font-bold bg-black/10 px-2 py-0.5 rounded">{cardData.cardId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-4 shadow-mamae border border-[#F0DDE4] flex flex-col gap-3">
              <button
                onClick={() => navigate("editaremergencia")}
                className="w-full bg-[#FBE8EF]/30 hover:bg-[#FBE8EF]/60 border border-[#F0DDE4] rounded-xl p-3.5 flex items-center gap-3 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FBE8EF] flex items-center justify-center text-[#D4638F] shrink-0">
                  <Edit size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-[#3D2B33] font-poppins">Dados de Emergência</h4>
                  <p className="text-[10px] text-[#8C6B7A] font-medium mt-0.5">Controle o que aparece ao ler o cartão</p>
                </div>
              </button>

              <button
                onClick={handleUnbind}
                className="w-full bg-[#FFF5F5] hover:bg-[#FEE2E2] border border-[#FEB2B2] rounded-xl p-3.5 flex items-center gap-3 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FDE8E8] flex items-center justify-center text-[#E53E3E] shrink-0">
                  <Trash2 size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-[#C53030] font-poppins">Desvincular Cartão</h4>
                  <p className="text-[10px] text-[#9B2C2C] font-medium mt-0.5">Remover associação atual</p>
                </div>
              </button>
            </div>
            
            <p className="text-[10.5px] text-[#8C6B7A] text-center font-medium mt-2 px-4 leading-relaxed">
              Encoste o seu cartão neste celular ou escaneie o QR Code para testar a visualização da página pública de emergência.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
