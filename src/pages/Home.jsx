import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  getInstantSupportedCrops, 
  getInstantCropStats,
  getInstantDiseaseIndex,
  preloadDatabase
} from '../data/optimizedDiseaseLoader';

const Home = () => {
  const [displayedCrops, setDisplayedCrops] = useState([]);
  
  // Get instant data for immediate rendering
  const supportedCrops = getInstantSupportedCrops();
  const cropStatistics = getInstantCropStats();
  const totalDiseases = getInstantDiseaseIndex().length;

  useEffect(() => {
    // Set data immediately for instant rendering
    setDisplayedCrops(supportedCrops);
    
    // Start preloading full database in background
    preloadDatabase();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#5c4d3c',
            fontWeight: 500,
            mb: 3
          }}
        >
          Crop Disease Detection
        </Typography>
        
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: '#7d7364',
            mb: 3,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          AI-powered disease detection for {supportedCrops.length} crops and {totalDiseases} disease types
        </Typography>

        {/* Supported Crops Display */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#5c4d3c',
              mb: 2,
              fontWeight: 500
            }}
          >
            Supported Crops & Vegetables:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            justifyContent: 'center',
            mb: 3
          }}>
            {displayedCrops.slice(0, 12).map(crop => (
              <Chip
                key={crop}
                label={crop}
                sx={{
                  backgroundColor: '#d0c8bc',
                  color: '#5c4d3c',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#5c4d3c',
                    color: 'white'
                  }
                }}
              />
            ))}
            {displayedCrops.length > 12 && (
              <Chip
                label={`+${displayedCrops.length - 12} more`}
                sx={{
                  backgroundColor: '#5c4d3c',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            )}
          </Box>
        </Box>

        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            mb: 8
          }}
        >
          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              backgroundColor: '#f5f2ea',
              flex: 1,
              maxWidth: '400px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '12px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#5c4d3c' }}>
              Analyze Your Crop
            </Typography>
            <Typography sx={{ mb: 3, color: '#7d7364' }}>
              Upload a photo of your affected crop and our AI will identify the disease and suggest solutions.
            </Typography>
            <Button 
              component={Link}
              to="/detect"
              variant="contained" 
              size="large"
              sx={{ 
                mt: 'auto', 
                backgroundColor: '#8c7b6b',
                '&:hover': {
                  backgroundColor: '#6a5c4f'
                }
              }}
            >
              Start Detection
            </Button>
          </Paper>

          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              backgroundColor: '#f5f2ea',
              flex: 1,
              maxWidth: '400px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '12px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#5c4d3c' }}>
              Disease Library
            </Typography>
            <Typography sx={{ mb: 3, color: '#7d7364' }}>
              Browse our extensive library of common crop diseases, causes, and treatment options.
            </Typography>
            <Button 
              component={Link}
              to="/library"
              variant="contained" 
              size="large"
              sx={{ 
                mt: 'auto', 
                backgroundColor: '#8c7b6b',
                '&:hover': {
                  backgroundColor: '#6a5c4f'
                }
              }}
            >
              Browse Library
            </Button>
          </Paper>
        </Box>

        {/* Supported Crops Statistics */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 4, 
            backgroundColor: '#f8f5f0',
            maxWidth: '1000px',
            mx: 'auto',
            mb: 6,
            borderRadius: '12px'
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ color: '#5c4d3c', textAlign: 'center', mb: 4 }}>
            Comprehensive Disease Detection Coverage
          </Typography>
          
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#7d7364', mb: 2 }}>
              🌾 {supportedCrops.length} Crops Supported • 🦠 {totalDiseases} Disease Types Detected
            </Typography>
            <Typography variant="body1" sx={{ color: '#7d7364', maxWidth: '800px', mx: 'auto' }}>
              Our comprehensive dataset covers diseases across major agricultural crops including fruits, vegetables, grains, and cash crops. 
              All data is sourced from real agricultural datasets and excludes healthy plant classifications to focus on disease detection.
            </Typography>
          </Box>

          <Typography variant="h6" component="h4" gutterBottom sx={{ color: '#5c4d3c', mb: 3 }}>
            Crop-wise Disease Coverage
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
            mb: 3
          }}>
            {Object.entries(cropStatistics)
              .sort(([,a], [,b]) => b - a)
              .map(([crop, diseaseCount]) => (
                <Paper 
                  key={crop}
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'white',
                    borderLeft: '3px solid #5c4d3c',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: '#f5f2ea'
                    }
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#5c4d3c', fontWeight: 500 }}>
                    {crop}
                  </Typography>
                  <Chip 
                    label={`${diseaseCount} diseases`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#d0c8bc', 
                      color: '#5c4d3c',
                      fontWeight: 500
                    }}
                  />
                </Paper>
              ))
            }
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button 
              component={Link}
              to="/supported-crops"
              variant="outlined"
              sx={{ 
                color: '#5c4d3c',
                borderColor: '#5c4d3c',
                '&:hover': {
                  backgroundColor: '#5c4d3c',
                  color: 'white'
                }
              }}
            >
              View Detailed Crop & Disease Information
            </Button>
          </Box>
        </Paper>

        <Paper 
          elevation={1}
          sx={{ 
            p: 4, 
            backgroundColor: '#eae5db',
            maxWidth: '900px',
            mx: 'auto',
            borderRadius: '12px'
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#5c4d3c' }}>
            How It Works
          </Typography>
          <Typography sx={{ mb: 2, color: '#7d7364', textAlign: 'left' }}>
            1. Take a clear photo of the affected part of your crop (leaves, stems, fruits, or roots)
          </Typography>
          <Typography sx={{ mb: 2, color: '#7d7364', textAlign: 'left' }}>
            2. Upload the image to our disease detection tool
          </Typography>
          <Typography sx={{ mb: 2, color: '#7d7364', textAlign: 'left' }}>
            3. Our AI analyzes the image and identifies the disease using advanced convolutional neural networks
          </Typography>
          <Typography sx={{ mb: 2, color: '#7d7364', textAlign: 'left' }}>
            4. Receive detailed information about the disease's cause, symptoms, and life cycle
          </Typography>
          <Typography sx={{ mb: 3, color: '#7d7364', textAlign: 'left' }}>
            5. Get targeted treatment recommendations and prevention strategies based on proven agricultural practices
          </Typography>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f2ea', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#5c4d3c', fontWeight: 500 }}>
              Understanding Plant Disease
            </Typography>
            <Typography variant="body2" sx={{ color: '#7d7364' }}>
              Plant diseases occur when three factors align: a susceptible host plant, a disease-causing pathogen (fungi, bacteria, viruses, or nematodes), and favorable environmental conditions. Our AI tool helps identify these elements to provide the most accurate diagnosis and treatment recommendations.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
