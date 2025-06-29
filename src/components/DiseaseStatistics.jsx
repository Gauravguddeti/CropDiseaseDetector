import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, Typography, Grid, Box, Paper, 
  Button, Tabs, Tab, IconButton, Tooltip 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAllDiseases } from '../services/diseaseService';
// Icons
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

const DiseaseStatistics = () => {
  const [diseaseStats, setDiseaseStats] = useState({
    byCrop: [],
    byPathogenType: [],
    byEpidemiologyType: []
  });
  const [tabValue, setTabValue] = useState(0);
  const [chartType, setChartType] = useState('pie');
  
  const chartRef = useRef(null);

  useEffect(() => {
    const diseases = getAllDiseases();
    
    // Group diseases by crop type
    const cropCounts = {};
    diseases.forEach(disease => {
      const crops = disease.crop.split('/');
      crops.forEach(crop => {
        const trimmedCrop = crop.trim();
        cropCounts[trimmedCrop] = (cropCounts[trimmedCrop] || 0) + 1;
      });
    });

    // Group diseases by pathogen type
    const pathogenCounts = {};
    diseases.forEach(disease => {
      const pathogen = disease.pathogenType || 'Unknown';
      pathogenCounts[pathogen] = (pathogenCounts[pathogen] || 0) + 1;
    });

    // Group diseases by epidemiology type
    const epidemiologyCounts = {};
    diseases.forEach(disease => {
      const epidemiology = disease.epidemiologyType || 'Unknown';
      epidemiologyCounts[epidemiology] = (epidemiologyCounts[epidemiology] || 0) + 1;
    });

    // Convert to array for charts and sort by count
    const byCrop = Object.keys(cropCounts)
      .map(key => ({ name: key, value: cropCounts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 crops

    const byPathogenType = Object.keys(pathogenCounts)
      .map(key => ({ name: key, value: pathogenCounts[key] }))
      .sort((a, b) => b.value - a.value);

    const byEpidemiologyType = Object.keys(epidemiologyCounts)
      .map(key => ({ name: key, value: epidemiologyCounts[key] }))
      .sort((a, b) => b.value - a.value);

    setDiseaseStats({
      byCrop,
      byPathogenType,
      byEpidemiologyType
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleChartType = () => {
    setChartType(chartType === 'pie' ? 'bar' : 'pie');
  };
  
  // Function to download chart as PNG
  const downloadChart = () => {
    if (!chartRef.current) return;
    
    try {
      // Create a canvas element
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.width.baseVal.value * 2; // Higher resolution
      canvas.height = svgElement.height.baseVal.value * 2;
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create an image from the SVG
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to PNG and download
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        let fileName;
        
        if (tabValue === 0) fileName = 'diseases-by-crop.png';
        else if (tabValue === 1) fileName = 'diseases-by-pathogen.png';
        else fileName = 'diseases-by-epidemiology.png';
        
        a.download = fileName;
        a.href = dataUrl;
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      console.error('Error downloading chart:', err);
    }
  };

  // Colors for the charts - earth tones to match the app's theme
  const COLORS = [
    '#8BC34A', '#4CAF50', '#009688', '#00796B', '#004D40', 
    '#2E7D32', '#1B5E20', '#33691E', '#827717', '#A1887F'
  ];

  const renderChart = (data) => {
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => [`${value} diseases`, 'Count']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
            <YAxis />
            <RechartsTooltip formatter={(value) => [`${value} diseases`, 'Count']} />
            <Bar dataKey="value" name="Diseases">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const getCurrentData = () => {
    switch (tabValue) {
      case 0:
        return diseaseStats.byCrop;
      case 1:
        return diseaseStats.byPathogenType;
      case 2:
        return diseaseStats.byEpidemiologyType;
      default:
        return [];
    }
  };

  const getChartTitle = () => {
    switch (tabValue) {
      case 0:
        return "Diseases by Crop Type";
      case 1:
        return "Diseases by Pathogen Type";
      case 2:
        return "Diseases by Epidemiology";
      default:
        return "Disease Statistics";
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f9f7f2', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#33691e', mb: 0 }}>
          Disease Statistics
          <Tooltip title="Visual representation of disease distribution across different categories">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        
        <Box>
          <Tooltip title={`Switch to ${chartType === 'pie' ? 'bar' : 'pie'} chart`}>
            <IconButton onClick={toggleChartType} size="small">
              {chartType === 'pie' ? <BarChartIcon /> : <PieChartIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Download chart as PNG">
            <IconButton onClick={downloadChart} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: 2,
          '& .MuiTab-root': { color: '#5c4d3c' },
          '& .Mui-selected': { color: '#33691e' }
        }}
      >
        <Tab label="By Crop" />
        <Tab label="By Pathogen" />
        <Tab label="By Epidemiology" />
      </Tabs>
      
      <Card sx={{ backgroundColor: 'white', borderRadius: 1 }} ref={chartRef}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            {getChartTitle()}
          </Typography>
          
          {renderChart(getCurrentData())}
        </CardContent>
      </Card>
    </Paper>
  );
};

export default DiseaseStatistics;
