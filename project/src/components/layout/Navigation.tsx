import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as LinkIcon, BarChart3 } from 'lucide-react';
import { logger } from '../../services/loggingService';

interface NavigationProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    logger.info('Navigation component mounted', 'Navigation', 'useEffect', { currentTab });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    logger.info('Navigation tab changed', 'Navigation', 'handleTabChange', { 
      previousTab: currentTab, 
      newTab: newValue 
    });
    onTabChange(event, newValue);
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ mr: 3 }}>
          <LinkIcon size={28} color="white" />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 1, 
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            URL Shortener
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 600,
                },
                minWidth: isMobile ? 60 : 120,
              },
            }}
          >
            <Tab 
              icon={<LinkIcon size={20} />} 
              label={!isMobile ? "Shortener" : ""} 
              iconPosition="start"
            />
            <Tab 
              icon={<BarChart3 size={20} />} 
              label={!isMobile ? "Statistics" : ""} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            display: { xs: 'none', md: 'block' }
          }}
        >
          AFFORDMED
        </Typography>
      </Toolbar>
    </AppBar>
  );
};