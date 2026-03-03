import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
/* import './assets/css/app.css'; */
import "./styles/landing.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
  </React.StrictMode>
);

/* import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
 */