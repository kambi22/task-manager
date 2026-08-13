import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(16px)",
          color: "#f8fafc",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "14px",
          fontSize: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#0f172a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f172a",
          },
        },
      }}
    />
  </StrictMode>,
)
