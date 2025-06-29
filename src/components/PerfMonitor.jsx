/**
 * Performance Monitor Component
 * Shows loading performance metrics in development
 */

import { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getPerformanceMetrics } from '../data/optimizedDiseaseLoader';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const newMetrics = getPerformanceMetrics();
      setMetrics(newMetrics);
    };

    // Initial metrics
    updateMetrics();

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000);

    // Show metrics after 1 second
    setTimeout(() => setShowMetrics(true), 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showMetrics || !metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: 2,
        zIndex: 9999,
        fontSize: '0.75rem'
      }}
    >
      <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
        🚀 Performance Metrics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Chip 
          label={`Index: ${metrics.indexLoadTime.toFixed(1)}ms`}
          size="small"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
        <Chip 
          label={`Full DB: ${metrics.fullLoadTime.toFixed(1)}ms`}
          size="small"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
        <Chip 
          label={`Cache Hits: ${metrics.cacheHits}`}
          size="small"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
        <Chip 
          label={metrics.isCached ? '✅ Cached' : '⏳ Loading'}
          size="small"
          sx={{ fontSize: '0.7rem', height: 20 }}
          color={metrics.isCached ? 'success' : 'warning'}
        />
      </Box>
    </Box>
  );
};

export default PerformanceMonitor;
