import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Navigation } from './components/layout/Navigation';
import { UrlShortener } from './pages/UrlShortener';
import { Statistics } from './pages/Statistics';
import { theme } from './theme/theme';
import { logger } from './services/loggingService';

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  React.useEffect(() => {
    logger.info('Application started', 'App', 'useEffect', { 
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    logger.info('Tab navigation', 'App', 'handleTabChange', { 
      previousTab: currentTab,
      newTab: newValue,
      tabNames: ['Shortener', 'Statistics']
    });
    setCurrentTab(newValue);
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 0:
        logger.debug('Rendering URL Shortener page', 'App', 'renderCurrentPage');
        return <UrlShortener />;
      case 1:
        logger.debug('Rendering Statistics page', 'App', 'renderCurrentPage');
        return <Statistics />;
      default:
        logger.warn('Unknown tab selected, defaulting to Shortener', 'App', 'renderCurrentPage', { 
          currentTab 
        });
        return <UrlShortener />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Navigation 
          currentTab={currentTab} 
          onTabChange={handleTabChange} 
        />
        <main>
          {renderCurrentPage()}
        </main>
      </Box>
    </ThemeProvider>
  );
}

export default App;