import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/botoes.css'
import './styles/formularios.css'
import './styles/cards.css'
import './styles/tabelas.css'
import './styles/alertas.css'
import './styles/status-leito.css'
import './styles/dialogo.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
