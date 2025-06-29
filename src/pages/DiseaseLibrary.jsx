import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, InputAdornment, 
  Card, CardContent, Tabs, Tab, Chip, Button, CircularProgress,
  Grid, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HealingIcon from '@mui/icons-material/Healing';
import { getAllDiseases, getUniqueCrops, searchDiseases, getDiseasesByCrop } from '../services/diseaseService';

const DiseaseLibrary = () => {
  const [diseaseLibraryData, setDiseaseLibraryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [cropFilter, setCropFilter] = useState('all');
  const [pathogenFilter, setPathogenFilter] = useState('all');
  const [uniqueCrops, setUniqueCrops] = useState([]);
  const [uniquePathogenTypes, setUniquePathogenTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 20;
  const bottomObserver = useRef(null);
  
  // Load diseases with pagination for better performance
  const loadDiseases = useCallback((newPage = 0, reset = false) => {
    setLoading(true);
    
    let result;
    
    if (searchQuery) {
      // When searching, we handle pagination differently
      setIsSearching(true);
      const searchResults = searchDiseases(searchQuery);
      const start = newPage * pageSize;
      const end = start + pageSize;
      
      result = {
        diseases: searchResults.slice(start, end),
        totalCount: searchResults.length,
        hasMore: end < searchResults.length
      };
    } else if (cropFilter !== 'all') {
      // Filter by crop
      result = getDiseasesByCrop(cropFilter, newPage, pageSize);
    } else {
      // Get all diseases with pagination
      result = getAllDiseases(newPage, pageSize);
    }
    
    setDiseaseLibraryData(prevData => 
      reset || newPage === 0 ? result.diseases : [...prevData, ...result.diseases]
    );
    setHasMore(result.hasMore);
    setTotalCount(result.totalCount);
    setPage(newPage);
    setLoading(false);
    setInitialLoading(false);
  }, [searchQuery, cropFilter, pageSize]);

  // Load initial data and metadata
  useEffect(() => {
    // Get unique crop and pathogen types for filters
    loadDiseases(0, true);
    
    // Load crop types for filtering
    const cropTypes = getUniqueCrops();
    if (cropTypes && cropTypes.length > 0) {
      setUniqueCrops(cropTypes.map(crop => crop.name));
    }
    
    // Extract unique pathogen types
    const pathogenTypes = new Set();
    getAllDiseases(0, 100).diseases.forEach(disease => {
      if (disease.pathogenType) {
        pathogenTypes.add(disease.pathogenType);
      }
    });
    setUniquePathogenTypes([...pathogenTypes].sort());
    
  }, [loadDiseases]);
  
  // Update when filters change
  useEffect(() => {
    loadDiseases(0, true);
  }, [searchQuery, cropFilter, pathogenFilter, loadDiseases]);
  
  // Handle infinite scrolling with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadDiseases(page + 1, false);
        }
      },
      { threshold: 0.5 }
    );
    
    const currentObserver = bottomObserver.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }
    
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, page, loadDiseases]);
  
  // Filter for pathogen type
  const filteredDiseases = diseaseLibraryData.filter(disease => {
    // We already filtered by search and crop with API calls
    // Just filter by pathogen type here (in-memory)
    return pathogenFilter === 'all' || disease.pathogenType === pathogenFilter;
  });
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleCropFilterChange = (event, newValue) => {
    setCropFilter(newValue);
  };
  
  const handlePathogenFilterChange = (event, newValue) => {
    setPathogenFilter(newValue);
  };
  
  const handleBackToLibrary = () => {
    setSelectedDisease(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Library Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#5c4d3c',
            fontWeight: 500
          }}
        >
          Disease Library
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '800px', mx: 'auto', mb: 2 }}
        >
          A comprehensive collection of crop diseases with detailed information, symptoms, and treatment options
        </Typography>
      </Box>
      
      {!selectedDisease ? (
        <Box>
          {/* Search and Filters */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 4,
              backgroundColor: '#f8f6f2',
              borderRadius: '8px'
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Search diseases by name, crop, or symptoms"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#8c7b6b' }} />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: '#ffffff' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#5c4d3c', fontWeight: 500 }}>
                  Filter by Crop
                </Typography>
                <Tabs
                  value={cropFilter}
                  onChange={handleCropFilterChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '.MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 'unset',
                      px: 2
                    }
                  }}
                >
                  <Tab 
                    label="All Crops" 
                    value="all" 
                    sx={{ color: cropFilter === 'all' ? '#5c4d3c' : '#7d7364' }} 
                  />
                  {uniqueCrops.map((crop) => (
                    <Tab 
                      key={crop} 
                      label={crop} 
                      value={crop} 
                      sx={{ color: cropFilter === crop ? '#5c4d3c' : '#7d7364' }} 
                    />
                  ))}
                </Tabs>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#5c4d3c', fontWeight: 500 }}>
                  Filter by Pathogen Type
                </Typography>
                <Tabs
                  value={pathogenFilter}
                  onChange={handlePathogenFilterChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '.MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 'unset',
                      px: 2
                    }
                  }}
                >
                  <Tab 
                    label="All Types" 
                    value="all" 
                    sx={{ color: pathogenFilter === 'all' ? '#5c4d3c' : '#7d7364' }} 
                  />
                  {uniquePathogenTypes.map((type) => (
                    <Tab 
                      key={type} 
                      label={type} 
                      value={type} 
                      sx={{ color: pathogenFilter === type ? '#5c4d3c' : '#7d7364' }} 
                    />
                  ))}
                </Tabs>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Initial loading state */}
          {initialLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={40} sx={{ color: '#5c4d3c' }} />
            </Box>
          ) : (
            <>
              {/* Results count */}
              <Typography 
                variant="subtitle1" 
                sx={{ mb: 2, color: '#7d7364' }}
              >
                {filteredDiseases.length} {filteredDiseases.length === 1 ? 'disease' : 'diseases'} found
                {totalCount > filteredDiseases.length && !loading ? ` (${totalCount} total)` : ''}
              </Typography>
              
              <Grid container spacing={3}>
                {filteredDiseases.map((disease) => (
                  <Grid item xs={12} sm={6} md={4} key={disease.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        backgroundColor: '#fcfaf5',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)'
                        },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={() => setSelectedDisease(disease)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            color: '#5c4d3c',
                            fontWeight: 600,
                            mb: 1
                          }}
                        >
                          {disease.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          <Chip 
                            label={disease.crop} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#e6dfcc',
                              color: '#5c4d3c'
                            }}
                          />
                          {disease.pathogenType && (
                            <Chip 
                              label={disease.pathogenType}
                              size="small" 
                              sx={{ 
                                backgroundColor: '#f5efe2',
                                color: '#5c4d3c'
                              }}
                            />
                          )}
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            mb: 1
                          }}
                        >
                          {disease.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Loading indicator for pagination */}
              {loading && !initialLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress size={30} sx={{ color: '#5c4d3c' }} />
                </Box>
              )}
              
              {/* Pagination observer element */}
              <Box ref={bottomObserver} sx={{ height: '20px', mt: 2 }} />
              
              {/* No results message */}
              {filteredDiseases.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#5c4d3c' }}>
                    No diseases found matching your criteria
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7d7364', mt: 1 }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            backgroundColor: '#fcfaf5',
            borderRadius: '8px'
          }}
        >
          {/* Disease Detail View */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{ color: '#5c4d3c', fontWeight: 600 }}
              >
                {selectedDisease.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={selectedDisease.crop} 
                  sx={{ 
                    backgroundColor: '#e6dfcc',
                    color: '#5c4d3c'
                  }}
                />
                {selectedDisease.pathogenType && (
                  <Chip 
                    label={selectedDisease.pathogenType}
                    sx={{ 
                      backgroundColor: '#f5efe2',
                      color: '#5c4d3c'
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <Box>
              <Box 
                component="button" 
                onClick={handleBackToLibrary}
                sx={{
                  backgroundColor: '#d0c8bc',
                  border: 'none',
                  color: '#5c4d3c',
                  px: 2,
                  py: 1,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#b6afa3'
                  },
                  '&:active': {
                    transform: 'translateY(1px)'
                  }
                }}
              >
                Back to Library
              </Box>
            </Box>
          </Box>
            
            {/* Reference images section removed to improve site stability */}
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#5c4d3c', mr: 2 }}>
                    Cause
                  </Typography>
                  {selectedDisease.pathogenType && (
                    <Box component="span">
                      <Chip 
                        size="small" 
                        label={selectedDisease.pathogenType} 
                        sx={{ backgroundColor: '#e6dfcc', color: '#5c4d3c' }}
                      />
                    </Box>
                  )}
                </Box>
                <Typography paragraph sx={{ color: '#7d7364' }}>
                  {selectedDisease.cause}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                  Description
                </Typography>
                <Typography paragraph sx={{ color: '#7d7364' }}>
                  {selectedDisease.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                  Symptoms
                </Typography>
                <Typography paragraph sx={{ color: '#7d7364' }}>
                  {selectedDisease.symptoms}
                </Typography>

                {selectedDisease.diseaseCycle && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                      Disease Cycle
                    </Typography>
                    <Typography paragraph sx={{ color: '#7d7364' }}>
                      {selectedDisease.diseaseCycle}
                    </Typography>
                  </>
                )}

                {selectedDisease.favorableConditions && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                      Favorable Conditions
                    </Typography>
                    <Typography paragraph sx={{ color: '#7d7364' }}>
                      {selectedDisease.favorableConditions}
                    </Typography>
                  </>
                )}

                {selectedDisease.epidemiologyType && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1, color: '#7d7364' }}>
                      Epidemiology Type:
                    </Typography>
                    <Box component="span">
                      <Chip 
                        size="small" 
                        label={selectedDisease.epidemiologyType} 
                        sx={{ 
                          backgroundColor: selectedDisease.epidemiologyType === 'Polycyclic' ? '#dde6ce' : '#f5efe2',
                          color: '#5c4d3c'
                        }}
                        title={selectedDisease.epidemiologyType === 'Polycyclic' ? 
                          'Multiple infection cycles per season' : 
                          selectedDisease.epidemiologyType === 'Monocyclic' ? 
                          'One infection cycle per season' : 
                          'Complex lifecycle with alternate hosts'}
                      />
                    </Box>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                  Recommended Solutions
                </Typography>
                <List sx={{ mb: 3 }}>
                  {selectedDisease.solutions.map((solution, idx) => (
                    <ListItem key={idx} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <HealingIcon sx={{ color: '#8c7b6b' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={solution} 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: '#7d7364'
                          }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="h6" gutterBottom sx={{ color: '#5c4d3c' }}>
                  Prevention Measures
                </Typography>
                <List>
                  {selectedDisease.preventions.map((prevention, idx) => (
                    <ListItem key={idx} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <CheckCircleOutlineIcon sx={{ color: '#8c7b6b' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={prevention} 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: '#7d7364'
                          }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default DiseaseLibrary;
