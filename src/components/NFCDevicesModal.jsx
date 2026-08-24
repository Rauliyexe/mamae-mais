import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  CreditCard, Watch, Key, Radio, CheckCircle2, ShieldCheck, 
  ExternalLink, Eye, EyeOff, RefreshCw, X, Sparkles, Smartphone,
  AlertCircle
} from "lucide-react";

export default function NFCDevicesModal() {
  const { 
    isNFCModalOpen, 
    setIsNFCModalOpen, 
    nfcWearables, 
    updateNFCWearable,
    user,
    currentWeek
  } = useApp();

  const [activeTab, setActiveTab] = useState("wristband"); // "card" | "wristband" | "keychain"
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!isNFCModalOpen) return null;

  const devicesList = [
    {
      key: "wristband",
      id: nfcWearables.wristband.id,
      title: "Pulseira Médica Inteligente",
      icon: Watch,
      location: "Uso contínuo no pulso",
      color: "#2E7D32",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      desc: "Acesso instantâneo para socorristas sem precisar desbloquear o celular.",
      badge: "Recomendado para o dia a dia",
    },
    {
      key: "card",
      id: nfcWearables.card.id,
      title: "Cartão NFC de Emergência",
      icon: CreditCard,
      location: "Carteira física ou bolsa",
      color: "#D4638F",
      bg: "bg-rose-50",
      border: "border-rose-200",
      desc: "Cartão oficial para consultas de pré-natal e triagem hospitalar.",
      badge: "Uso Clínico e Hospitalar",
    },
    {
      key: "keychain",
      id: nfcWearables.keychain.id,
      title: "Chaveiro de Resgate",
      icon: Key,
      location: "Bolsa de maternidade & Chaves",
      color: "#8E24AA",
      bg: "bg-purple-50",
      border: "border-purple-200",
      desc: "Identificação rápida em trânsito ou no trajeto até a maternidade.",
      badge: "Mala da Maternidade",
    },
  ];

  const currentDevice = nfcWearables[activeTab];
  const currentDeviceMeta = devicesList.find((d) => d.key === activeTab);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        setScanSuccess(false);
        window.open(`/emergencia/${currentDevice.id}`, "_blank");
      }, 1200);
    }, 1500);
  };

  const handleNativeNFCWrite = async () => {
    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{
            recordType: "url",
            data: `${window.location.origin}/emergencia/${currentDevice.id}`
          }]
        });
        showToast("Dados gravados no chip NFC com sucesso!");
      } catch (err) {
        showToast("Aproxime o dispositivo NFC da traseira do aparelho.");
      }
    } else {
      // Simulated write
      showToast(`Dispositivo ${currentDevice.name} sincronizado com sucesso!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-4 select-none font-albert animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl border border-[#F0DDE4] overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3D2B33] to-[#4A4743] text-white p-4.5 px-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D4638F] shadow-inner">
              <Radio size={24} className="text-[#FBE8EF] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-poppins font-bold text-[15px] tracking-wide text-white">
                  Acessórios NFC de Emergência
                </h3>
                <span className="bg-[#81C784] text-[#1B5E20] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  3 Dispositivos
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                Cartão, Pulseira Médica & Chaveiro de Resgate
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNFCModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="p-3 bg-[#FAF8F5] border-b border-[#F0DDE4] flex gap-2">
          {devicesList.map((dev) => {
            const Icon = dev.icon;
            const isSelected = activeTab === dev.key;
            return (
              <button
                key={dev.key}
                onClick={() => setActiveTab(dev.key)}
                className={`flex-1 p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#D4638F] shadow-sm text-[#D4638F]"
                    : "bg-white/60 border-[#F0DDE4] text-[#8C6B7A] hover:bg-white"
                }`}
              >
                <Icon size={18} strokeWidth={2.2} />
                <span className="text-[10px] font-bold truncate max-w-[85px]">{dev.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin bg-[#FAF8F5]">
          
          {/* Active Device Showcase Banner */}
          <div className={`p-5 rounded-[28px] border ${currentDeviceMeta.bg} ${currentDeviceMeta.border} shadow-sm space-y-3`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#8C6B7A] bg-white px-2.5 py-0.5 rounded-full border border-black/5">
                  {currentDeviceMeta.badge}
                </span>
                <h4 className="text-[16px] font-bold text-[#3D2B33] font-poppins mt-2">
                  {currentDeviceMeta.title}
                </h4>
                <p className="text-[11px] text-[#558B2F] font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={12} />
                  <span>Chip Ativo · Tag ID: <b>{currentDevice.id}</b></span>
                </p>
              </div>

              <div className="w-14 h-14 rounded-3xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#D4638F] shadow-sm">
                <currentDeviceMeta.icon size={26} />
              </div>
            </div>

            <p className="text-[11.5px] text-[#4A4743] leading-relaxed">
              {currentDeviceMeta.desc}
            </p>

            {/* Tap-to-Scan Interactive Simulator */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleSimulateScan}
                disabled={scanning || scanSuccess}
                className="flex-1 bg-white hover:bg-[#FAF3F6] border border-[#F0DDE4] text-[#3D2B33] text-xs font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-80"
              >
                {scanning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-[#D4638F]" />
                    <span>Aproximando Leitor...</span>
                  </>
                ) : scanSuccess ? (
                  <>
                    <CheckCircle2 size={14} className="text-[#2E7D32]" />
                    <span>Leitura Confirmada!</span>
                  </>
                ) : (
                  <>
                    <Smartphone size={14} className="text-[#D4638F]" />
                    <span>Simular Leitura NFC</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNativeNFCWrite}
                className="bg-[#D4638F] hover:bg-[#B84D75] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Radio size={14} />
                <span>Gravar no Chip</span>
              </button>
            </div>
          </div>

          {/* Broadcast Data Fields for this Wearable */}
          <div className="bg-white p-4 rounded-2xl border border-[#F0DDE4] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-[12px] font-bold text-[#3D2B33] font-poppins flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#D4638F]" />
                Dados Transmitidos por este Acessório
              </h5>
              <span className="text-[9.5px] font-bold text-[#8C6B7A]">
                Página Pública Segura
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FAF3F6]/50 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Nome Completo</span>
                <span className="font-bold text-[#3D2B33] truncate block">{user.name}</span>
              </div>
              <div className="p-2.5 bg-[#FAF3F6]/50 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Idade Gestacional</span>
                <span className="font-bold text-[#D4638F] block">{currentWeek}ª Semana</span>
              </div>
              <div className="p-2.5 bg-[#FAF3F6]/50 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Tipo Sanguíneo</span>
                <span className="font-bold text-red-600 block">A+ (Positivo)</span>
              </div>
              <div className="p-2.5 bg-[#FAF3F6]/50 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Contato de Apoio</span>
                <span className="font-bold text-[#2E7D32] block">Ligação Direta</span>
              </div>
            </div>

            {/* Direct Link Preview */}
            <a
              href={`/emergencia/${currentDevice.id}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#FAF3F6] hover:bg-[#FBE8EF] border border-[#F0DDE4] text-[#D4638F] text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Visualizar Ficha Pública do Dispositivo ({currentDevice.id})</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Quick Guide */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#F0DDE4] shadow-xs text-xs space-y-1.5 text-[#523A46]">
            <p className="font-bold text-[#3D2B33] flex items-center gap-1">
              <Sparkles size={13} className="text-[#D4638F]" />
              Como socorristas usam seu NFC:
            </p>
            <p className="text-[10.5px] text-[#8C6B7A] leading-relaxed">
              Basta qualquer pessoa aproximar um smartphone com leitor NFC (Android ou iPhone) da sua pulseira, chaveiro ou cartão. A página de emergência abrirá instantaneamente no navegador com rotas para o hospital mais próximo e ligação para sua rede de apoio.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#F0DDE4] flex justify-end shrink-0">
          <button
            onClick={() => setIsNFCModalOpen(false)}
            className="bg-[#D4638F] hover:bg-[#B84D75] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Concluir
          </button>
        </div>

      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#3D2B33] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-xl border border-white/10 z-[250] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-[#81C784]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
