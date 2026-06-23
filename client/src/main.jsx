import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import './styles/index.css';
import './styles/admin.css';
import App        from './App';
import AdminPanel from './components/AdminPanel';

// Enrutado mínimo sin react-router: /admin → panel, todo lo demás → sitio público
const isAdmin = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminPanel /> : <App />}
  </StrictMode>
);
