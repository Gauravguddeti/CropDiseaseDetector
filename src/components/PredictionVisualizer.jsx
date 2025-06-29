import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Grid, LinearProgress, Box, 
  Card, CardContent, IconButton, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

/**
 * A visualization component for disease detection results
 * Displays prediction confidence scores with visual bars
 */
const PredictionVisualizer = ({ open, onClose, predictions, imageUrl }) => {
  const [sortedPredictions, setSortedPredictions] = useState([]);
  const barColors = useRef([
    '#8BC34A', // Primary color (green)
    '#AED581', // Lighter shade
    '#C5E1A5', // Even lighter
    '#DCEDC8', // Very light
    '#F1F8E9'  // Almost white
  ]);

  useEffect(() => {
    if (predictions && predictions.length) {
      // Sort by confidence (highest first) and take top 5
      const sorted = [...predictions]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
      
      setSortedPredictions(sorted);
    }
  }, [predictions]);

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#fcfaf5'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#5c4d3c', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          Disease Prediction Results
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Image preview */}
          <Grid item xs={12} md={5}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <Box 
                component="img"
                src={imageUrl || '/images/placeholder-disease.jpg'}
                alt="Analyzed crop image"
                sx={{ 
                  width: '100%', 
                  height: 300,
                  objectFit: 'contain'
                }}
              />
            </Card>
          </Grid>
          
          {/* Predictions */}
          <Grid item xs={12} md={7}>
            <Card elevation={2} sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Confidence Scores
                </Typography>
                <Tooltip title="The model's confidence level for each potential disease. Higher percentage indicates greater confidence.">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {sortedPredictions.map((pred, index) => (
                <Box key={pred.className} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      {pred.className.replace(/_/g, ' ').replace('___', ' - ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {(pred.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={pred.confidence * 100}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      mt: 0.5,
                      bgcolor: '#e0ddd5',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: barColors.current[Math.min(index, barColors.current.length - 1)]
                      }
                    }}
                  />
                </Box>
              ))}
              
              {sortedPredictions.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 4 }}>
                  No predictions available
                </Typography>
              )}
            </Card>
          </Grid>
          
          {/* Explanation */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, mt: 1, bgcolor: '#f5f2ea' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <strong>How to interpret:</strong> The model analyzes the image and provides confidence scores for possible diseases.
                  Higher percentages indicate greater confidence in the diagnosis. For accurate results, 
                  ensure images are clear, well-lit, and focus directly on the affected plant parts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#5c4d3c', borderColor: '#5c4d3c' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PredictionVisualizer;
