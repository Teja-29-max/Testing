import { ApiResponse, ShortenedUrl, UrlSubmission, UrlStatistics } from '../types';
import { logger } from './loggingService';

class UrlService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
    logger.info('UrlService initialized', 'UrlService', 'constructor', { apiBaseUrl: this.apiBaseUrl });
  }

  async shortenUrl(submission: UrlSubmission): Promise<ApiResponse<ShortenedUrl>> {
    try {
      logger.info('Initiating URL shortening request', 'UrlService', 'shortenUrl', { 
        originalUrl: submission.originalUrl,
        hasCustomShortcode: !!submission.preferredShortcode,
        validityPeriod: submission.validityPeriod
      });

      const response = await fetch(`${this.apiBaseUrl}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error('URL shortening failed', 'UrlService', 'shortenUrl', { 
          error: data.error, 
          status: response.status,
          originalUrl: submission.originalUrl
        });
        return { success: false, error: data.error || 'Failed to shorten URL' };
      }

      logger.info('URL shortened successfully', 'UrlService', 'shortenUrl', { 
        shortCode: data.shortCode,
        originalUrl: submission.originalUrl
      });
      return { success: true, data };
    } catch (error: any) {
      logger.error('Network error during URL shortening', 'UrlService', 'shortenUrl', { 
        error: error.message,
        originalUrl: submission.originalUrl
      });
      return { success: false, error: 'Network error occurred. Please check your connection.' };
    }
  }

  async getShortenedUrls(): Promise<ApiResponse<ShortenedUrl[]>> {
    try {
      logger.info('Fetching shortened URLs list', 'UrlService', 'getShortenedUrls');

      const response = await fetch(`${this.apiBaseUrl}/urls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error('Failed to fetch shortened URLs', 'UrlService', 'getShortenedUrls', { 
          error: data.error, 
          status: response.status
        });
        return { success: false, error: data.error || 'Failed to fetch URLs' };
      }

      logger.info('Successfully fetched shortened URLs', 'UrlService', 'getShortenedUrls', { 
        count: data.length
      });
      return { success: true, data };
    } catch (error: any) {
      logger.error('Network error fetching URLs', 'UrlService', 'getShortenedUrls', { 
        error: error.message
      });
      return { success: false, error: 'Network error occurred. Please check your connection.' };
    }
  }

  async getUrlStatistics(shortCode: string): Promise<ApiResponse<UrlStatistics>> {
    try {
      logger.info('Fetching URL statistics', 'UrlService', 'getUrlStatistics', { shortCode });

      const response = await fetch(`${this.apiBaseUrl}/stats/${shortCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error('Failed to fetch URL statistics', 'UrlService', 'getUrlStatistics', { 
          error: data.error, 
          status: response.status,
          shortCode
        });
        return { success: false, error: data.error || 'Failed to fetch statistics' };
      }

      logger.info('Successfully fetched URL statistics', 'UrlService', 'getUrlStatistics', { 
        shortCode, 
        clickCount: data.clickDetails?.length || 0
      });
      return { success: true, data };
    } catch (error: any) {
      logger.error('Network error fetching statistics', 'UrlService', 'getUrlStatistics', { 
        error: error.message,
        shortCode
      });
      return { success: false, error: 'Network error occurred. Please check your connection.' };
    }
  }
}

export const urlService = new UrlService();