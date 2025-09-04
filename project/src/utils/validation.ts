import { ValidationResult } from '../types';
import { logger } from '../services/loggingService';

export const validateUrl = (url: string): ValidationResult => {
  logger.debug('Starting URL validation', 'ValidationUtils', 'validateUrl', { url: url.substring(0, 50) + '...' });

  if (!url.trim()) {
    const error = 'URL is required';
    logger.warn('URL validation failed: empty URL', 'ValidationUtils', 'validateUrl');
    return { isValid: false, error };
  }

  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:'];
    
    if (!validProtocols.includes(urlObj.protocol)) {
      const error = 'URL must use HTTP or HTTPS protocol';
      logger.warn('URL validation failed: invalid protocol', 'ValidationUtils', 'validateUrl', { 
        protocol: urlObj.protocol 
      });
      return { isValid: false, error };
    }

    if (url.length > 2048) {
      const error = 'URL is too long (maximum 2048 characters)';
      logger.warn('URL validation failed: URL too long', 'ValidationUtils', 'validateUrl', { 
        length: url.length 
      });
      return { isValid: false, error };
    }

    logger.info('URL validation successful', 'ValidationUtils', 'validateUrl');
    return { isValid: true };
  } catch (error: any) {
    const errorMessage = 'Please enter a valid URL';
    logger.warn('URL validation failed: invalid format', 'ValidationUtils', 'validateUrl', { 
      error: error.message 
    });
    return { isValid: false, error: errorMessage };
  }
};

export const validateValidityPeriod = (period: string): ValidationResult => {
  logger.debug('Starting validity period validation', 'ValidationUtils', 'validateValidityPeriod', { period });

  if (!period.trim()) {
    logger.info('Validity period validation: empty period (optional field)', 'ValidationUtils', 'validateValidityPeriod');
    return { isValid: true };
  }

  const numericPeriod = parseInt(period, 10);

  if (isNaN(numericPeriod)) {
    const error = 'Validity period must be a number';
    logger.warn('Validity period validation failed: not a number', 'ValidationUtils', 'validateValidityPeriod', { 
      period 
    });
    return { isValid: false, error };
  }

  if (numericPeriod <= 0) {
    const error = 'Validity period must be greater than 0';
    logger.warn('Validity period validation failed: non-positive number', 'ValidationUtils', 'validateValidityPeriod', { 
      period: numericPeriod 
    });
    return { isValid: false, error };
  }

  if (numericPeriod > 525600) { // 1 year in minutes
    const error = 'Validity period cannot exceed 1 year (525,600 minutes)';
    logger.warn('Validity period validation failed: exceeds maximum', 'ValidationUtils', 'validateValidityPeriod', { 
      period: numericPeriod 
    });
    return { isValid: false, error };
  }

  logger.info('Validity period validation successful', 'ValidationUtils', 'validateValidityPeriod', { 
    period: numericPeriod 
  });
  return { isValid: true };
};

export const validateShortcode = (shortcode: string): ValidationResult => {
  logger.debug('Starting shortcode validation', 'ValidationUtils', 'validateShortcode', { shortcode });

  if (!shortcode.trim()) {
    logger.info('Shortcode validation: empty shortcode (optional field)', 'ValidationUtils', 'validateShortcode');
    return { isValid: true };
  }

  const shortcodeRegex = /^[a-zA-Z0-9_-]+$/;

  if (!shortcodeRegex.test(shortcode)) {
    const error = 'Shortcode can only contain letters, numbers, underscores, and hyphens';
    logger.warn('Shortcode validation failed: invalid characters', 'ValidationUtils', 'validateShortcode', { 
      shortcode 
    });
    return { isValid: false, error };
  }

  if (shortcode.length < 3) {
    const error = 'Shortcode must be at least 3 characters long';
    logger.warn('Shortcode validation failed: too short', 'ValidationUtils', 'validateShortcode', { 
      shortcode,
      length: shortcode.length
    });
    return { isValid: false, error };
  }

  if (shortcode.length > 20) {
    const error = 'Shortcode cannot exceed 20 characters';
    logger.warn('Shortcode validation failed: too long', 'ValidationUtils', 'validateShortcode', { 
      shortcode,
      length: shortcode.length
    });
    return { isValid: false, error };
  }

  logger.info('Shortcode validation successful', 'ValidationUtils', 'validateShortcode', { 
    shortcode 
  });
  return { isValid: true };
};