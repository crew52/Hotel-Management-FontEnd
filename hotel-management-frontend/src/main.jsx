import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider defaultMode="system" modeStorageKey="hotel-management-color-scheme">
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>
)
