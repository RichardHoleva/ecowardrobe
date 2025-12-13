// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx';
import { ItemsProvider } from './context/ItemsContext.jsx';

// Use basename only in production (GitHub Pages)
const basename = import.meta.env.PROD ? '/ecowardrobe' : '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <UserProvider>
        <ItemsProvider>
          <App />
        </ItemsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)