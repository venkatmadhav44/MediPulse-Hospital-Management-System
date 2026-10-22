import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Custom Vanilla CSS Design System
import './styles/index.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/modules.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { ToastProvider } from './components/common/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HospitalProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </HospitalProvider>
    </AuthProvider>
  </React.StrictMode>
);
