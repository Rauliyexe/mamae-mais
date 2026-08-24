import React, { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle2, Heart } from "lucide-react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if previously captured globally in index.html
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
      setShowBanner(true);
    }

    // Check if dismissed recently in this session
    const isDismissed = sessionStorage.getItem("pwa_banner_dismissed");
    if (isDismissed) return;

    // Listen for beforeinstallprompt on Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handlePromptAvailable = () => {
      if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(window.deferredPWAInstallPrompt);
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwa-prompt-available", handlePromptAvailable);

    // If on iOS and not standalone, show the banner after a gentle delay
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Show banner after brief delay if prompt wasn't dismissed
    const fallbackTimer = setTimeout(() => {
      if (!isStandalone && !sessionStorage.getItem("pwa_banner_dismissed")) {
        setShowBanner(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa-prompt-available", handlePromptAvailable);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;

    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult && choiceResult.outcome === "accepted") {
          setShowBanner(false);
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        window.deferredPWAInstallPrompt = null;
      } catch (err) {
        console.error("Erro ao executar instalador PWA:", err);
        setShowIOSModal(true);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Direct instructions modal if native prompt was not supplied by browser
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_banner_dismissed", "true");
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-[390px] z-50 animate-fadeIn">
        <div className="bg-gradient-to-r from-[#4A4743] to-[#C38B9B] text-white p-3.5 rounded-2xl shadow-[0_12px_36px_rgba(74,71,67,0.15)] border border-white/20 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Heart size={20} className="text-white fill-white/20" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-[12.5px] font-bold font-poppins flex items-center gap-1.5 leading-tight">
              Instalar Mamãe+ no Celular
              <Sparkles size={13} className="text-[#FAF3F6]" />
            </h4>
            <p className="text-[10.5px] text-white/85 truncate font-medium mt-0.5">
              Acesso rápido em tela cheia e offline
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white text-[#4A4743] hover:bg-[#FAF3F6] text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} strokeWidth={2.5} />
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* iOS & Manual Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-[#3D2B33] shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF3F6] text-[#8C6B7A] flex items-center justify-center hover:bg-[#F5ECEF] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Smartphone size={24} className="text-[#C38B9B]" />
            </div>

            <h3 className="text-lg font-bold font-poppins text-center text-[#4A4743]">
              {isIOS ? "Instalar no seu iPhone / iPad" : "Instalar Aplicativo Mamãe+"}
            </h3>
            <p className="text-xs text-[#8C6B7A] text-center mt-1 mb-5">
              Tenha a experiência completa de aplicativo diretamente na sua tela de início.
            </p>

            <div className="flex bg-[#FAF3F6] p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setIsIOS(false)}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  !isIOS ? "bg-white text-[#C38B9B] shadow-sm" : "text-[#8C6B7A]"
                }`}
              >
                Android / Chrome
              </button>
              <button
                type="button"
                onClick={() => setIsIOS(true)}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  isIOS ? "bg-white text-[#C38B9B] shadow-sm" : "text-[#8C6B7A]"
                }`}
              >
                iPhone / iPad (iOS)
              </button>
            </div>

            <div className="space-y-3.5 mb-6 text-xs text-[#523A46]">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3 bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-[#3D2B33]">Toque no botão Compartilhar</p>
                      <p className="text-[#8C6B7A] text-[11px] flex items-center gap-1 mt-0.5">
                        Na barra inferior do Safari, clique no ícone <Share size={12} className="text-[#007AFF]" />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-[#3D2B33]">Adicionar à Tela de Início</p>
                      <p className="text-[#8C6B7A] text-[11px] flex items-center gap-1 mt-0.5">
                        Role as opções e toque em <PlusSquare size={12} className="text-[#C38B9B]" /> <b>Adicionar à Tela de Início</b>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-[#3D2B33]">Pronto! Abra pelo ícone</p>
                      <p className="text-[#8C6B7A] text-[11px] mt-0.5">
                        O Mamãe+ abrirá em tela inteira sem barras de navegação do browser.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-[#3D2B33]">Menu do Navegador</p>
                      <p className="text-[#8C6B7A] text-[11px] mt-0.5">
                        Toque no menu de três pontos (⋮) no canto superior ou no aviso de instalação.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
                    <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-[#3D2B33]">Instalar Aplicativo</p>
                      <p className="text-[#8C6B7A] text-[11px] mt-0.5">
                        Toque em <b>"Instalar aplicativo"</b> ou <b>"Adicionar à tela inicial"</b>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold py-3 rounded-2xl transition-colors shadow-md text-xs font-poppins flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} /> Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
