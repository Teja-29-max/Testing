import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Copy, ExternalLink, Clock, Calendar } from 'lucide-react';
import { ShortenedUrl } from '../../types';
import { formatDateTime, isExpired } from '../../utils/dateUtils';
import { logger } from '../../services/loggingService';

interface ResultCardProps {
  result: ShortenedUrl;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

  React.useEffect(() => {
    logger.debug('ResultCard component mounted', 'ResultCard', 'useEffect', { 
      shortCode: result.shortCode 
    });
  }, [result.shortCode]);

  const handleCopyToClipboard = async (textToCopy: string, type: string) => {
    try {
      logger.info('Attempting to copy to clipboard', 'ResultCard', 'handleCopyToClipboard', { 
        type, 
        shortCode: result.shortCode 
      });

      await navigator.clipboard.writeText(textToCopy);
      setCopySnackbarOpen(true);
      
      logger.info('Successfully copied to clipboard', 'ResultCard', 'handleCopyToClipboard', { 
        type, 
        shortCode: result.shortCode 
      });
    } catch (error: any) {
      logger.error('Failed to copy to clipboard', 'ResultCard', 'handleCopyToClipboard', { 
        error: error.message,
        type, 
        shortCode: result.shortCode 
      });
    }
  };

  const handleVisitUrl = () => {
    logger.info('Opening shortened URL', 'ResultCard', 'handleVisitUrl', { 
      shortUrl: result.shortUrl,
      shortCode: result.shortCode 
    });
    window.open(result.shortUrl, '_blank');
  };

  const expired = isExpired(result.expiryDate);

  return (
    <>
      <Card 
        sx={{ 
          mb: 2,
          border: expired ? '2px solid #d32f2f' : '1px solid #e0e0e0',
          opacity: expired ? 0.7 : 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
          },
        }}
        elevation={2}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Original URL
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all',
                  mb: 2,
                  color: expired ? 'text.disabled' : 'text.primary'
                }}
              >
                {result.originalUrl}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <Box flex={1}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Shortened URL
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="h6" 
                  color={expired ? 'text.disabled' : 'primary'}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {result.shortUrl}
                </Typography>
                <Tooltip title="Copy short URL">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyToClipboard(result.shortUrl, 'shortUrl')}
                    disabled={expired}
                    color="primary"
                  >
                    <Copy size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Visit shortened URL">
                  <IconButton
                    size="small"
                    onClick={handleVisitUrl}
                    disabled={expired}
                    color="primary"
                  >
                    <ExternalLink size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Calendar size={16} />
              <Typography variant="body2" color="textSecondary">
                Created: {formatDateTime(result.createdAt)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Clock size={16} />
              <Typography variant="body2" color="textSecondary">
                Expires: {formatDateTime(result.expiryDate)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={expired ? 'Expired' : 'Active'}
              color={expired ? 'error' : 'success'}
              variant={expired ? 'outlined' : 'filled'}
              size="small"
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCopyToClipboard(result.shortCode, 'shortcode')}
              disabled={expired}
              startIcon={<Copy size={16} />}
            >
              Copy Code
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCopySnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setCopySnackbarOpen(false)}>
          Copied to clipboard successfully!
        </Alert>
      </Snackbar>
    </>
  );
};