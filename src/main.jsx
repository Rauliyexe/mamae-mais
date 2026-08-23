import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PaginaEmergencia from './screens/Publico/PaginaEmergencia.jsx'

const path = window.location.pathname;

// Intercept routing for the public emergency page
const renderApp = () => {
  if (path.startsWith('/emergencia/')) {
    return <PaginaEmergencia />;
  }
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {renderApp()}
  </StrictMode>,
)
