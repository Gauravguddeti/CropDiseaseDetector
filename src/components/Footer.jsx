import { Box, Container, Typography, Link as MuiLink, Grid, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: '#eae5db',
        borderTop: '1px solid #d0c8bc'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#5c4d3c', mb: 2 }}>
              CropScan AI
            </Typography>
            <Typography sx={{ color: '#7d7364' }}>
              Helping farmers identify crop diseases and find solutions using artificial intelligence.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ color: '#5c4d3c', mb: 2 }}>
              Pages
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Home
              </MuiLink>
              <MuiLink href="/detect" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Disease Detection
              </MuiLink>
              <MuiLink href="/library" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Disease Library
              </MuiLink>
              <MuiLink href="/about" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                About
              </MuiLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#5c4d3c', mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Farming Best Practices
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Agricultural Extension Offices
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}>
                Research Publications
              </MuiLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#5c4d3c', mb: 2 }}>
              Contact & Connect
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#7d7364', fontSize: 20 }} />
                <MuiLink 
                  href="mailto:guddetigaurav1@gmail.com" 
                  sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}
                >
                  guddetigaurav1@gmail.com
                </MuiLink>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkedInIcon sx={{ color: '#7d7364', fontSize: 20 }} />
                <MuiLink 
                  href="https://www.linkedin.com/in/gaurav-guddeti-a2359827b" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}
                >
                  LinkedIn Profile
                </MuiLink>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHubIcon sx={{ color: '#7d7364', fontSize: 20 }} />
                <MuiLink 
                  href="https://github.com/Gauravguddeti" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#7d7364', textDecoration: 'none', '&:hover': { color: '#5c4d3c' } }}
                >
                  GitHub Profile
                </MuiLink>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#7d7364', fontStyle: 'italic' }}>
              Created by Gaurav Guddeti
            </Typography>
          </Grid>
        </Grid>
        
        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            pt: 4, 
            mt: 4,
            color: '#7d7364',
            borderTop: '1px solid #d0c8bc'
          }}
        >
          © {new Date().getFullYear()} CropScan AI by Gaurav Guddeti. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
