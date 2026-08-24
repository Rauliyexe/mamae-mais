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
import CartaoNFC from "./screens/Perfil/CartaoNFC";
import EditarEmergencia from "./screens/Perfil/EditarEmergencia";
import PortalMedico from "./screens/PortalMedico";
import BibliotecaExames from "./screens/BibliotecaExames";

import SOSModal from "./components/SOSModal";
import SmartwatchModal from "./components/SmartwatchModal";
import NFCDevicesModal from "./components/NFCDevicesModal";

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
      case "cartaonfc": return <CartaoNFC />;
      case "editaremergencia": return <EditarEmergencia />;
      case "portalmedico": return <PortalMedico />;
      case "bibliotecaexames": return <BibliotecaExames />;
      default: return <Login />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh]">
      <PWALayout 
        nav={isLoggedIn && currentScreen !== "portalmedico" ? <BottomNav /> : null}
        renderScreenContent={renderScreen}
      >
        {renderScreen()}
        <PWAInstallBanner />
      </PWALayout>

      {/* Global Modals */}
      <SOSModal />
      <SmartwatchModal />
      <NFCDevicesModal />
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
