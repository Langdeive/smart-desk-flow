
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css' // Adding App.css import to apply gradient styles

createRoot(document.getElementById("root")!).render(<App />);

