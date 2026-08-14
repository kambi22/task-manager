import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            backdropFilter: "blur(16px)",
            color: "var(--toast-text)",
            border: "1px solid var(--toast-border)",
            borderRadius: "14px",
            fontSize: "14px",
            boxShadow: "var(--toast-shadow)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "var(--toast-success-secondary)",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "var(--toast-error-secondary)",
            },
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>,
)
