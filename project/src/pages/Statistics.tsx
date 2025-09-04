import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Button,
  Fade,
  LinearProgress,
} from '@mui/material';
import { BarChart3, RefreshCw, TrendingUp } from 'lucide-react';
import { StatisticsCard } from '../components/statistics/StatisticsCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ShortenedUrl, UrlStatistics } from '../types';
import { urlService } from '../services/urlService';
import { logger } from '../services/loggingService';

export const Statistics: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [urlStatistics, setUrlStatistics] = useState<{ [key: string]: UrlStatistics }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    logger.info('Statistics page mounted', 'Statistics', 'useEffect');
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      logger.info('Fetching URLs for statistics', 'Statistics', 'fetchUrls');
      setLoading(true);
      setError('');

      const response = await urlService.getShortenedUrls();
      
      if (response.success && response.data) {
        logger.info('Successfully fetched URLs', 'Statistics', 'fetchUrls', { 
          urlCount: response.data.length 
        });
        setUrls(response.data);
      } else {
        const errorMessage = response.error || 'Failed to fetch URLs';
        logger.error('Failed to fetch URLs', 'Statistics', 'fetchUrls', { error: errorMessage });
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = 'Network error occurred';
      logger.error('Network error fetching URLs', 'Statistics', 'fetchUrls', { 
        error: error.message 
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlDetails = async (shortCode: string) => {
    try {
      logger.info('Fetching detailed statistics for URL', 'Statistics', 'fetchUrlDetails', { 
        shortCode 
      });

      const response = await urlService.getUrlStatistics(shortCode);
      
      if (response.success && response.data) {
        logger.info('Successfully fetched URL statistics', 'Statistics', 'fetchUrlDetails', { 
          shortCode,
          clickCount: response.data.clickDetails?.length || 0
        });
        setUrlStatistics(prev => ({
          ...prev,
          [shortCode]: response.data!
        }));
      } else {
        logger.error('Failed to fetch URL statistics', 'Statistics', 'fetchUrlDetails', { 
          shortCode,
          error: response.error 
        });
      }
    } catch (error: any) {
      logger.error('Network error fetching URL statistics', 'Statistics', 'fetchUrlDetails', { 
        shortCode,
        error: error.message 
      });
    }
  };

  const handleRefresh = async () => {
    logger.info('Refreshing statistics data', 'Statistics', 'handleRefresh');
    setRefreshing(true);
    await fetchUrls();
    setUrlStatistics({}); // Clear cached statistics
    setRefreshing(false);
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeUrls = urls.filter(url => !url.isExpired).length;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner message="Loading statistics..." size={50} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
          <BarChart3 size={32} color="#1976d2" />
          <Typography variant="h3" color="primary" fontWeight={700}>
            URL Statistics
          </Typography>
        </Box>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Comprehensive analytics for all your shortened URLs
        </Typography>
        <Typography variant="body2" color="textSecondary">
          AFFORDMED - Advanced Analytics Dashboard
        </Typography>
      </Box>

      {error && (
        <Fade in>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {refreshing && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white'
            }}
          >
            <TrendingUp size={32} />
            <Typography variant="h4" fontWeight={700} mt={1}>
              {urls.length}
            </Typography>
            <Typography variant="body1">
              Total URLs
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #00838f 0%, #4fb3bf 100%)',
              color: 'white'
            }}
          >
            <BarChart3 size={32} />
            <Typography variant="h4" fontWeight={700} mt={1}>
              {totalClicks}
            </Typography>
            <Typography variant="body1">
              Total Clicks
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white'
            }}
          >
            <LinkIcon size={32} />
            <Typography variant="h4" fontWeight={700} mt={1}>
              {activeUrls}
            </Typography>
            <Typography variant="body1">
              Active URLs
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            URL Details
          </Typography>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
          >
            Refresh
          </Button>
        </Box>

        {urls.length > 0 ? (
          <Box>
            {urls.map((url) => (
              <StatisticsCard
                key={url.id}
                url={url}
                clickDetails={urlStatistics[url.shortCode]?.clickDetails}
                onViewDetails={fetchUrlDetails}
              />
            ))}
          </Box>
        ) : (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight={300}
            textAlign="center"
          >
            <BarChart3 size={64} color="#e0e0e0" />
            <Typography variant="h6" color="textSecondary" mt={2}>
              No URLs found
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Start by shortening some URLs to see analytics here
            </Typography>
            <Button
              variant="contained"
              startIcon={<LinkIcon size={20} />}
              onClick={() => window.location.reload()}
            >
              Go to Shortener
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};