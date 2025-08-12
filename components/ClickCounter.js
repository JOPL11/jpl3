'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  LinearProgress,
  IconButton
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';

// Generate sample data for the chart
const generateChartData = (count) => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i,
    value: Math.floor(count * (0.6 + Math.random() * 0.8)) // Randomize around the count
  }));
};

const ClickCounter = ({ onMapClick }) => {
  const [clickCount, setClickCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  
  // Load saved count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('mapClickCount');
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      setClickCount(count);
      setChartData(generateChartData(count));
    } else {
      setChartData(generateChartData(0));
    }
  }, []);

  // Save count to localStorage when it changes
  useEffect(() => {
    if (clickCount > 0) { // Only save if we have clicks
      localStorage.setItem('mapClickCount', clickCount.toString());
      setChartData(generateChartData(clickCount));
    }
  }, [clickCount]);

  const handleClick = (e) => {
    e.stopPropagation();
    setClickCount(prev => prev + 1);
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    setClickCount(0);
  };

  // Find max value for scaling
  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    <Card 
      elevation={2}
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 11,
        right: 0,
        width: 208,
        zIndex: 1000,
        backgroundColor: 'rgba(29, 28, 28, 0.55)',
        backdropFilter: 'blur(4px)',
        borderRadius: '5px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 6px 11px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, mt: 0, height: 20, alignItems: 'flex-end' }}>
          {chartData.map((item, index) => (
            <Box 
              key={index}
              sx={{
                flex: 1,
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: 'primary.main',
                opacity: 0.9,
                borderRadius: '2px 2px 0 0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 1
                }
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClickCounter;