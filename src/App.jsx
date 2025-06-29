import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PerfMonitor from './components/PerfMonitor';
// Implement lazy loading for better performance
import Home from './pages/Home';  // Keep Home non-lazy for faster initial load
const DetectDisease = lazy(() => import('./pages/DetectDisease'));
const DiseaseLibrary = lazy(() => import('./pages/DiseaseLibrary.jsx'));
const About = lazy(() => import('./pages/About'));
const SupportedCrops = lazy(() => import('./components/SupportedCrops'));
import './App.css';

// Create a custom theme with our neutral, earthy color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#5c4d3c', // Rich brown
      light: '#8c7b6b', // Light brown
      dark: '#3f342a', // Dark brown
    },
    secondary: {
      main: '#d0c8bc', // Beige
      light: '#f5f2ea', // Light beige
      dark: '#a69c8e', // Dark beige
    },
    background: {
      default: '#f8f6f2', // Very light beige for background
      paper: '#ffffff',
    },
    text: {
      primary: '#5c4d3c', // Main text color
      secondary: '#7d7364', // Secondary text color
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <CircularProgress color="primary" />
  </Box>
);

function App() {
  useEffect(() => {
    // Preload important routes when homepage is loaded and idle
    const preloadRoutes = () => {
      // Use requestIdleCallback to avoid blocking main thread
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          // Preload the disease detection page - most likely to be used
          import('./pages/DetectDisease');
          // Preload optimized disease loader
          import('./data/optimizedDiseaseLoader').then(module => {
            module.preloadDatabase();
          });
          console.log('✅ Preloaded critical routes and database during idle time');
        }, { timeout: 2000 });
      }
    };
    
    preloadRoutes();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detect" element={
                <Suspense fallback={<LoadingFallback />}>
                  <DetectDisease />
                </Suspense>
              } />
              <Route path="/library" element={
                <Suspense fallback={<LoadingFallback />}>
                  <DiseaseLibrary />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<LoadingFallback />}>
                  <About />
                </Suspense>
              } />
              <Route path="/supported-crops" element={
                <Suspense fallback={<LoadingFallback />}>
                  <SupportedCrops />
                </Suspense>
              } />
            </Routes>
          </Box>
          <Footer />
          <PerfMonitor />
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
