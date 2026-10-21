import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GamesProvider } from './context/GamesContext.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GamesProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </GamesProvider>
  </StrictMode>,
)
