import { logger } from '../services/loggingService';

export const formatDateTime = (dateString: string): string => {
  try {
    logger.debug('Formatting datetime', 'DateUtils', 'formatDateTime', { dateString });
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      logger.warn('Invalid date string provided', 'DateUtils', 'formatDateTime', { dateString });
      return 'Invalid Date';
    }

    const formatted = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    logger.debug('Date formatted successfully', 'DateUtils', 'formatDateTime', { 
      original: dateString, 
      formatted 
    });
    
    return formatted;
  } catch (error: any) {
    logger.error('Error formatting date', 'DateUtils', 'formatDateTime', { 
      error: error.message,
      dateString
    });
    return 'Invalid Date';
  }
};

export const isExpired = (expiryDate: string): boolean => {
  try {
    logger.debug('Checking expiry status', 'DateUtils', 'isExpired', { expiryDate });
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    if (isNaN(expiry.getTime())) {
      logger.warn('Invalid expiry date provided', 'DateUtils', 'isExpired', { expiryDate });
      return false;
    }

    const expired = expiry < now;
    logger.debug('Expiry check completed', 'DateUtils', 'isExpired', { 
      expiryDate, 
      expired 
    });
    
    return expired;
  } catch (error: any) {
    logger.error('Error checking expiry status', 'DateUtils', 'isExpired', { 
      error: error.message,
      expiryDate
    });
    return false;
  }
};

export const getRelativeTime = (dateString: string): string => {
  try {
    logger.debug('Getting relative time', 'DateUtils', 'getRelativeTime', { dateString });
    
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      logger.warn('Invalid date string for relative time', 'DateUtils', 'getRelativeTime', { dateString });
      return 'Unknown';
    }

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  } catch (error: any) {
    logger.error('Error calculating relative time', 'DateUtils', 'getRelativeTime', { 
      error: error.message,
      dateString
    });
    return 'Unknown';
  }
};