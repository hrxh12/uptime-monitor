import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter = poore app ko routing ki power deta hai (iske bina Link/Routes nahi chalte)
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* App ko BrowserRouter ke andar lapeto — tabhi URL ke hisaab se pages badlenge */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
