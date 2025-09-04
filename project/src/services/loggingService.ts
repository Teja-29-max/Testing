import { LogEntry } from '../types';

class LoggingService {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    component: string,
    method: string,
    metadata?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      component,
      method,
      message,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private async sendLogToBackend(entry: LogEntry): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail if logging service is unavailable
    }
  }

  debug(message: string, component: string, method: string, metadata?: any): void {
    const entry = this.createLogEntry('DEBUG', message, component, method, metadata);
    this.addLog(entry);
    this.sendLogToBackend(entry);
  }

  info(message: string, component: string, method: string, metadata?: any): void {
    const entry = this.createLogEntry('INFO', message, component, method, metadata);
    this.addLog(entry);
    this.sendLogToBackend(entry);
  }

  warn(message: string, component: string, method: string, metadata?: any): void {
    const entry = this.createLogEntry('WARN', message, component, method, metadata);
    this.addLog(entry);
    this.sendLogToBackend(entry);
  }

  error(message: string, component: string, method: string, metadata?: any): void {
    const entry = this.createLogEntry('ERROR', message, component, method, metadata);
    this.addLog(entry);
    this.sendLogToBackend(entry);
  }

  getLogs(level?: LogEntry['level'], limit?: number): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(0, limit);
    }

    return filteredLogs;
  }

  clearLogs(): void {
    this.info('Clearing application logs', 'LoggingService', 'clearLogs');
    this.logs = [];
  }
}

export const logger = new LoggingService();