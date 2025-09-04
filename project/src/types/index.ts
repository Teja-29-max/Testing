export interface UrlSubmission {
  originalUrl: string;
  validityPeriod?: number;
  preferredShortcode?: string;
}

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdAt: string;
  expiryDate: string;
  isExpired: boolean;
  clickCount: number;
}

export interface ClickDetail {
  id: string;
  timestamp: string;
  source: string;
  location: string;
  userAgent?: string;
}

export interface UrlStatistics {
  shortenedUrl: ShortenedUrl;
  clickDetails: ClickDetail[];
}

export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  component: string;
  method: string;
  message: string;
  metadata?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LogLevel {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  component?: string;
  action?: string;
  data?: any;
}