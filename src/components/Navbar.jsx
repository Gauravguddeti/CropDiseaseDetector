import { AppBar, Toolbar, Typography, Box, Button, Container, useScrollTrigger, Slide } from '@mui/material';
import { Link } from 'react-router-dom';

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  return (
    <HideOnScroll {...props}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: '#f5f2ea',
          borderBottom: '1px solid #e0d6c8'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/"
              sx={{ 
                flexGrow: 1,
                textDecoration: 'none',
                color: '#5c4d3c',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}
            >
              CropScan AI
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={Link} 
                to="/"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to="/detect"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                Detect
              </Button>
              <Button 
                component={Link} 
                to="/library"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                Library
              </Button>
              <Button 
                component={Link} 
                to="/supported-crops"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                Crops
              </Button>
              <Button 
                component={Link} 
                to="/about"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                About
              </Button>
              <Button 
                component={Link} 
                to="/dataset-manager"
                sx={{ 
                  color: '#5c4d3c',
                  '&:hover': {
                    color: '#3f342a',
                    backgroundColor: 'rgba(92, 77, 60, 0.04)'
                  }
                }}
              >
                Dataset
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
