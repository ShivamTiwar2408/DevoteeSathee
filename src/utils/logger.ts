/**
 * Centralized logging service for debugging and monitoring
 * In production, this would integrate with services like:
 * - Sentry for error tracking
 * - Firebase Crashlytics
 * - DataDog / New Relic
 * - Custom analytics backend
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  sessionId: string;
}

// Generate a unique session ID for this app instance
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// In-memory log buffer for debugging (limited to last 100 entries)
const LOG_BUFFER: LogEntry[] = [];
const MAX_BUFFER_SIZE = 100;

const addToBuffer = (entry: LogEntry): void => {
  LOG_BUFFER.push(entry);
  if (LOG_BUFFER.length > MAX_BUFFER_SIZE) {
    LOG_BUFFER.shift();
  }
};

const formatLogEntry = (entry: LogEntry): string => {
  const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`;
};

const createLogEntry = (level: LogLevel, message: string, context?: LogContext): LogEntry => ({
  level,
  message,
  context,
  timestamp: new Date().toISOString(),
  sessionId: SESSION_ID,
});

const shouldLog = (level: LogLevel): boolean => {
  // In production, you might want to filter out debug logs
  if (!__DEV__ && level === 'debug') {
    return false;
  }
  return true;
};

const sendToRemote = async (entry: LogEntry): Promise<void> => {
  // In production, send critical logs to your backend
  // This is a placeholder for integration with logging services
  if (!__DEV__ && (entry.level === 'error' || entry.level === 'warn')) {
    try {
      // Example: Send to your logging endpoint
      // await fetch('https://your-logging-service.com/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch {
      // Silently fail - don't let logging errors crash the app
    }
  }
};

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!shouldLog('debug')) return;
    const entry = createLogEntry('debug', message, context);
    addToBuffer(entry);
    console.log(formatLogEntry(entry));
  },

  info(message: string, context?: LogContext): void {
    if (!shouldLog('info')) return;
    const entry = createLogEntry('info', message, context);
    addToBuffer(entry);
    console.info(formatLogEntry(entry));
  },

  warn(message: string, context?: LogContext): void {
    if (!shouldLog('warn')) return;
    const entry = createLogEntry('warn', message, context);
    addToBuffer(entry);
    console.warn(formatLogEntry(entry));
    sendToRemote(entry);
  },

  error(message: string, context?: LogContext): void {
    if (!shouldLog('error')) return;
    const entry = createLogEntry('error', message, context);
    addToBuffer(entry);
    console.error(formatLogEntry(entry));
    sendToRemote(entry);
  },

  // Get recent logs for debugging
  getRecentLogs(): LogEntry[] {
    return [...LOG_BUFFER];
  },

  // Get session ID for tracking
  getSessionId(): string {
    return SESSION_ID;
  },

  // Clear log buffer
  clearBuffer(): void {
    LOG_BUFFER.length = 0;
  },
};

// Export types for external use
export type { LogLevel, LogContext, LogEntry };
