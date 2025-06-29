import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#5c4d3c',
            textAlign: 'center',
            mb: 4
          }}
        >
          About CropScan AI
        </Typography>
        
        <Paper 
          elevation={2}
          sx={{ 
            p: 4, 
            backgroundColor: '#f5f2ea',
            borderRadius: '12px',
            mb: 4
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ color: '#5c4d3c' }}>
                Our Mission
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                CropScan AI is dedicated to helping farmers around the world identify and manage crop diseases quickly and accurately. By leveraging artificial intelligence, we provide accessible tools that can help increase crop yields, reduce waste, and improve food security globally.
              </Typography>
              
              <Typography paragraph sx={{ color: '#7d7364' }}>
                Our mission is to democratize agricultural technology and make advanced disease detection accessible to farmers everywhere, from large commercial operations to small-scale subsistence farmers.
              </Typography>
              
              <Typography variant="h5" gutterBottom sx={{ color: '#5c4d3c', mt: 4 }}>
                The Problem We're Solving
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                Crop diseases result in an estimated 20-40% yield loss globally each year. Early detection and proper management are crucial, but many farmers lack access to agricultural experts or laboratory testing facilities, especially in developing regions.
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                By bringing disease detection to smartphones and computers, we're providing a solution that can be used anywhere, enabling faster responses and better disease management.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ color: '#5c4d3c' }}>
                Our Technology
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                CropScan AI uses deep learning technologies to analyze images of plants and identify diseases based on visual symptoms. Our neural network models have been trained on thousands of images of healthy and diseased crops across various species.
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                The technology examines key indicators such as leaf color changes, spot patterns, lesion characteristics, and fungal structures to identify diseases accurately. We employ convolutional neural networks (CNNs) for image recognition, segmentation for lesion-level detection, and implement multiple models specialized for different crop types.
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                The platform is designed to continually improve as more data is collected, increasing accuracy and expanding the range of diseases it can detect. We follow the disease triangle principle - identifying the susceptible host plant, the pathogen involved, and the environmental conditions that enable disease development.
              </Typography>
              
              <Typography variant="h5" gutterBottom sx={{ color: '#5c4d3c', mt: 4 }}>
                Future Development
              </Typography>
              <Typography paragraph sx={{ color: '#7d7364' }}>
                We're working on expanding our disease detection capabilities to cover more crop varieties and conditions. Future updates will include:
              </Typography>
              <ul>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Offline detection capabilities for areas with limited connectivity using lightweight MobileNetV2 models
                </Typography>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Integration with weather data to create epidemiological models for disease forecasting
                </Typography>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Community features to connect farmers facing similar issues
                </Typography>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Advanced segmentation models to detect early-stage infections before visible symptoms develop
                </Typography>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Mobile applications with real-time detection for field use
                </Typography>
                <Typography component="li" sx={{ color: '#7d7364', mb: 1 }}>
                  Expanded database with additional metadata on disease types, epidemiology patterns, and management strategies
                </Typography>
              </ul>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper 
          elevation={1}
          sx={{ 
            p: 4, 
            backgroundColor: '#eae5db',
            borderRadius: '12px'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#5c4d3c', textAlign: 'center' }}>
            How You Can Help
          </Typography>
          <Typography paragraph sx={{ color: '#7d7364', textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            The accuracy of our disease detection improves with more data. If you're a farmer, agricultural expert, or researcher, consider contributing to our database by sharing images of identified crop diseases.
          </Typography>
          <Typography paragraph sx={{ color: '#7d7364', textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            Contact us at contribute@cropscanai.com to learn more about data contribution or potential collaborations.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;
