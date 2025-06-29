import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Chip, 
  Grid, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  CircularProgress
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { 
  getInstantDiseaseIndex,
  getInstantCropStats,
  getInstantSupportedCrops,
  loadFullDiseaseDatabase
} from '../data/optimizedDiseaseLoader';

const SupportedCrops = () => {
  const [cropsData, setCropsData] = useState({});
  const [expandedCrops, setExpandedCrops] = useState({});
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const [hasFullData, setHasFullData] = useState(false);

  // Get instant data for immediate rendering
  const supportedCrops = getInstantSupportedCrops();
  const totalDiseases = getInstantDiseaseIndex().length;

  useEffect(() => {
    // Process instant disease index for immediate display
    const diseases = getInstantDiseaseIndex();
    const cropsMap = {};
    
    diseases.forEach(disease => {
      const crop = disease.crop;
      if (!cropsMap[crop]) {
        cropsMap[crop] = [];
      }
      cropsMap[crop].push(disease);
    });
    
    setCropsData(cropsMap);

    // Load full data in background for enhanced details
    const loadEnhancedData = async () => {
      setIsLoadingFullData(true);
      try {
        const fullDiseases = await loadFullDiseaseDatabase();
        const enhancedCropsMap = {};
        
        fullDiseases.forEach(disease => {
          const crop = disease.crop;
          if (!enhancedCropsMap[crop]) {
            enhancedCropsMap[crop] = [];
          }
          enhancedCropsMap[crop].push(disease);
        });
        
        setCropsData(enhancedCropsMap);
        setHasFullData(true);
      } catch (error) {
        console.error('Error loading full disease data:', error);
      } finally {
        setIsLoadingFullData(false);
      }
    };

    // Start loading enhanced data after a short delay
    setTimeout(loadEnhancedData, 100);
  }, []);

  const handleCropToggle = (crop) => {
    setExpandedCrops(prev => ({
      ...prev,
      [crop]: !prev[crop]
    }));
  };

  const totalCrops = supportedCrops.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          color: '#5c4d3c',
          fontWeight: 600,
          mb: 4,
          textAlign: 'center'
        }}
      >
        Supported Crops & Diseases
      </Typography>
      
      <Paper 
        elevation={2}
        sx={{ 
          p: 4, 
          backgroundColor: '#f5f2ea',
          mb: 4
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ color: '#5c4d3c', fontWeight: 500 }}
        >
          Detection Capabilities
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#7d7364', mb: 3 }}
        >
          Our AI-powered system can detect diseases across {totalCrops} different crops, 
          identifying {totalDiseases} specific disease conditions. Upload a clear photo 
          of your plant's affected area for accurate diagnosis and treatment recommendations.
          {!hasFullData && (
            <Box component="span" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Loading detailed information...
            </Box>
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label={`${totalCrops} Crops Supported`}
            sx={{ 
              backgroundColor: '#5c4d3c', 
              color: 'white',
              fontWeight: 500
            }}
          />
          <Chip 
            label={`${totalDiseases} Disease Types`}
            sx={{ 
              backgroundColor: '#d0c8bc', 
              color: '#5c4d3c',
              fontWeight: 500
            }}
          />
        </Box>
      </Paper>

      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          color: '#5c4d3c',
          fontWeight: 500,
          mb: 3
        }}
      >
        Crop Categories
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(cropsData).sort().map(([crop, diseases]) => (
          <Grid item xs={12} md={6} lg={4} key={crop}>
            <Paper 
              elevation={1}
              sx={{ 
                p: 3,
                backgroundColor: 'white',
                borderLeft: '4px solid #5c4d3c',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleCropToggle(crop)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#5c4d3c',
                    fontWeight: 600
                  }}
                >
                  {crop}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${diseases.length} diseases`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#d0c8bc', 
                      color: '#5c4d3c',
                      fontSize: '0.75rem'
                    }}
                  />
                  {expandedCrops[crop] ? <ExpandLess /> : <ExpandMore />}
                </Box>
              </Box>
              
              <Collapse in={expandedCrops[crop]} timeout="auto" unmountOnExit>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {diseases.map((disease, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText 
                        primary={disease.name}
                        secondary={`${disease.pathogenType} • ${disease.cause}`}
                        primaryTypographyProps={{
                          sx: { color: '#5c4d3c', fontWeight: 500, fontSize: '0.9rem' }
                        }}
                        secondaryTypographyProps={{
                          sx: { color: '#7d7364', fontSize: '0.8rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper 
        elevation={2}
        sx={{ 
          p: 4, 
          backgroundColor: '#f5f2ea',
          mt: 4
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ color: '#5c4d3c', fontWeight: 500 }}
        >
          How to Use
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#7d7364', mb: 2 }}
        >
          <strong>1. Take a clear photo:</strong> Capture the affected area of your plant with good lighting.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#7d7364', mb: 2 }}
        >
          <strong>2. Upload for analysis:</strong> Use our detection tool to upload your photo.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#7d7364', mb: 2 }}
        >
          <strong>3. Get instant results:</strong> Receive disease identification with confidence scores.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#7d7364' }}
        >
          <strong>4. Follow recommendations:</strong> Get detailed treatment and prevention advice.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SupportedCrops;
