import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import PWALayout from "./components/PWALayout";
import BottomNav from "./components/BottomNav";
import PWAInstallBanner from "./components/PWAInstallBanner";

// Screen Imports
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import Formulario from "./screens/Formulario";
import Inicio from "./screens/Inicio";
import Diario from "./screens/Diario";
import Calendario from "./screens/Calendario";
import Comunidade from "./screens/Comunidade";
import Perfil from "./screens/Perfil";
import Receitas from "./screens/Receitas";
import Saude from "./screens/Saude";
import ChatIA from "./screens/ChatIA";
import Notificacoes from "./screens/Notificacoes";
import Conquistas from "./screens/Conquistas";
import CartaoNFC from "./screens/Perfil/CartaoNFC";
import EditarEmergencia from "./screens/Perfil/EditarEmergencia";
import { 
  Trophy, BookOpen, Award, Droplet, Heart, MessageSquare, Users, Activity, Sparkles, Smile, Scale, Calendar, CheckCircle2 
} from "lucide-react";

function AchievementToast() {
  const { newAchievement } = useApp();
  if (!newAchievement) return null;

  const renderAchievementIcon = (iconName) => {
    const props = { size: 20, className: "text-[#C38B9B]" };
    switch (iconName) {
      case "BookOpen": return <BookOpen {...props} />;
      case "Award": return <Award {...props} />;
      case "Droplet": return <Droplet {...props} />;
      case "Heart": return <Heart {...props} />;
      case "MessageSquare": return <MessageSquare {...props} />;
      case "Users": return <Users {...props} />;
      case "Activity": return <Activity {...props} />;
      case "Sparkles": return <Sparkles {...props} />;
      case "Smile": return <Smile {...props} />;
      case "Scale": return <Scale {...props} />;
      case "Calendar": return <Calendar {...props} />;
      case "CheckCircle2": return <CheckCircle2 {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  return (
    <div className="absolute top-14 left-4 right-4 bg-white border border-[#C38B9B]/20 rounded-2xl p-3.5 shadow-[0_12px_28px_rgba(74,71,67,0.08)] flex items-center gap-3 z-[60] animate-fadeIn">
      <div className="w-10 h-10 rounded-2xl bg-[#FAF3F6] flex items-center justify-center shrink-0 shadow-sm">
        {renderAchievementIcon(newAchievement.icon)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-[#C38B9B] font-extrabold uppercase tracking-wider flex items-center gap-1">
          <Trophy size={10} /> Conquista Desbloqueada!
        </p>
        <h4 className="text-[13px] font-bold text-[#3D2B33] font-poppins truncate">{newAchievement.title}</h4>
        <p className="text-[10px] text-[#8C6B7A] truncate font-medium">{newAchievement.description}</p>
      </div>
    </div>
  );
}

import NinaMascot from "./components/NinaMascot";
import PortalMedico from "./screens/PortalMedico";
import BibliotecaExames from "./screens/BibliotecaExames";

function AppContent() {
  const { currentScreen, isLoggedIn } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case "login": return <Login />;
      case "cadastro": return <Cadastro />;
      case "formulario": return <Formulario />;
      case "inicio": return <Inicio />;
      case "diario": return <Diario />;
      case "calendario": return <Calendario />;
      case "comunidade": return <Comunidade />;
      case "perfil": return <Perfil />;
      case "receitas": return <Receitas />;
      case "saude": return <Saude />;
      case "chatia": return <ChatIA />;
      case "notificacoes": return <Notificacoes />;
      case "conquistas": return <Conquistas />;
      case "cartaonfc": return <CartaoNFC />;
      case "editaremergencia": return <EditarEmergencia />;
      case "portalmedico": return <PortalMedico />;
      case "bibliotecaexames": return <BibliotecaExames />;
      default: return <Login />;
    }
  };

  const hideMascot = ["login", "cadastro", "formulario", "portalmedico", "bibliotecaexames"].includes(currentScreen);

  return (
    <div className="relative w-full h-full min-h-[100dvh]">
      <PWALayout 
        nav={isLoggedIn && currentScreen !== "portalmedico" ? <BottomNav /> : null}
        renderScreenContent={renderScreen}
      >
        {renderScreen()}
        <AchievementToast />
        <PWAInstallBanner />
      </PWALayout>
      {isLoggedIn && !hideMascot && <NinaMascot />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
