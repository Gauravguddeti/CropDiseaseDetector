import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add performance measurement for debugging
const startTime = performance.now();

// Create root with concurrent mode enabled for better performance
const root = createRoot(document.getElementById('root'));

// Render app with Strict Mode
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Log performance metrics
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`Initial application load time: ${loadTime.toFixed(2)}ms`);
  
  // Report performance metrics
  if ('performance' in window && 'getEntriesByType' in performance) {
    const paintMetrics = performance.getEntriesByType('paint');
    if (paintMetrics.length > 0) {
      paintMetrics.forEach(metric => {
        console.log(`${metric.name}: ${metric.startTime.toFixed(2)}ms`);
      });
    }
  }
});
