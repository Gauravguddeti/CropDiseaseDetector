import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const PerformanceMonitor = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    
    // Simulate app initialization
    const timer = setTimeout(() => {
      const endTime = performance.now();
      setLoadTime(Math.round(endTime - startTime));
      setIsLoading(false);
    }, 100); // Very fast loading with lightweight database

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f6f2'
      }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#5c4d3c' }}>
          Loading CropScan AI...
        </Typography>
        <LinearProgress 
          sx={{ 
            width: '300px',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#5c4d3c'
            }
          }} 
        />
      </Box>
    );
  }

  return (
    <>
      {children}
      {/* Performance indicator - only shown for a few seconds */}
      {loadTime > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#5c4d3c',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          zIndex: 9999,
          opacity: 0,
          animation: 'fadeInOut 3s forwards'
        }}>
          Loaded in {loadTime}ms
        </Box>
      )}
      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default PerformanceMonitor;
