import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Expand as ExpandMore, Expand as ExpandLess, Copy, ExternalLink, MousePointer, Calendar, MapPin, Globe, Clock } from 'lucide-react';
import { ShortenedUrl, ClickDetail } from '../../types';
import { formatDateTime, isExpired, getRelativeTime } from '../../utils/dateUtils';
import { logger } from '../../services/loggingService';

interface StatisticsCardProps {
  url: ShortenedUrl;
  clickDetails?: ClickDetail[];
  onViewDetails?: (shortCode: string) => void;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
  url, 
  clickDetails = [],
  onViewDetails 
}) => {
  const [expanded, setExpanded] = useState(false);

  React.useEffect(() => {
    logger.debug('StatisticsCard component mounted', 'StatisticsCard', 'useEffect', { 
      shortCode: url.shortCode,
      clickCount: url.clickCount
    });
  }, [url.shortCode, url.clickCount]);

  const handleToggleExpanded = () => {
    const newExpanded = !expanded;
    logger.info('Toggling statistics details', 'StatisticsCard', 'handleToggleExpanded', { 
      shortCode: url.shortCode,
      expanded: newExpanded
    });
    setExpanded(newExpanded);

    if (newExpanded && onViewDetails && clickDetails.length === 0) {
      onViewDetails(url.shortCode);
    }
  };

  const handleCopyUrl = async () => {
    try {
      logger.info('Copying URL to clipboard', 'StatisticsCard', 'handleCopyUrl', { 
        shortUrl: url.shortUrl 
      });
      await navigator.clipboard.writeText(url.shortUrl);
    } catch (error: any) {
      logger.error('Failed to copy URL', 'StatisticsCard', 'handleCopyUrl', { 
        error: error.message 
      });
    }
  };

  const handleVisitUrl = () => {
    logger.info('Opening URL in new tab', 'StatisticsCard', 'handleVisitUrl', { 
      shortUrl: url.shortUrl 
    });
    window.open(url.shortUrl, '_blank');
  };

  const expired = isExpired(url.expiryDate);

  return (
    <Card 
      sx={{ 
        mb: 3,
        border: expired ? '2px solid #ffcdd2' : '1px solid #e0e0e0',
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
                mb: 1,
                color: expired ? 'text.disabled' : 'text.primary'
              }}
            >
              {url.originalUrl}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography 
                variant="h6" 
                color={expired ? 'text.disabled' : 'primary'}
                sx={{ wordBreak: 'break-all' }}
              >
                {url.shortUrl}
              </Typography>
              <Tooltip title="Copy URL">
                <IconButton 
                  size="small" 
                  onClick={handleCopyUrl}
                  disabled={expired}
                  color="primary"
                >
                  <Copy size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Visit URL">
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
            <Calendar size={16} color="#9e9e9e" />
            <Typography variant="body2" color="textSecondary">
              Created: {formatDateTime(url.createdAt)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Clock size={16} color="#9e9e9e" />
            <Typography variant="body2" color="textSecondary">
              Expires: {formatDateTime(url.expiryDate)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" gap={2} alignItems="center">
            <Chip
              label={expired ? 'Expired' : 'Active'}
              color={expired ? 'error' : 'success'}
              variant={expired ? 'outlined' : 'filled'}
              size="small"
            />
            <Chip
              label={`${url.clickCount} clicks`}
              color="primary"
              variant="outlined"
              size="small"
              icon={<MousePointer size={16} />}
            />
          </Box>
          
          {url.clickCount > 0 && (
            <Button
              onClick={handleToggleExpanded}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              size="small"
              variant="outlined"
            >
              {expanded ? 'Hide' : 'Show'} Details
            </Button>
          )}
        </Box>

        <Collapse in={expanded && url.clickCount > 0}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom color="primary">
            Click Details
          </Typography>
          
          {clickDetails.length > 0 ? (
            <List dense>
              {clickDetails.map((click, index) => (
                <React.Fragment key={click.id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Clock size={14} />
                            <Typography variant="body2" fontWeight={500}>
                              {getRelativeTime(click.timestamp)}
                            </Typography>
                          </Box>
                          {click.source && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Globe size={14} />
                              <Typography variant="body2" color="textSecondary">
                                {click.source}
                              </Typography>
                            </Box>
                          )}
                          {click.location && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <MapPin size={14} />
                              <Typography variant="body2" color="textSecondary">
                                {click.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {formatDateTime(click.timestamp)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < clickDetails.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
              Loading click details...
            </Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};