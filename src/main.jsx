// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx';
import { ItemsProvider } from './context/ItemsContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ItemsProvider>
          <App />
        </ItemsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)