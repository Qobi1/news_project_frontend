import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMetaTags } from './utils/initialMetaTags';

// Initialize meta tags before React hydration to ensure they're visible in page source
initializeMetaTags();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
