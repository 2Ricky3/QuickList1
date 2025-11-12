interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, any>;
}
class ErrorLogger {
  private isDevelopment = __DEV__;
  logError(error: Error | unknown, context?: ErrorContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    if (this.isDevelopment) {
      console.error('Ã°Å¸â€Â´ ERROR:', errorMessage);
      if (context) {
        console.error('Context:', context);
      }
      if (errorStack) {
        console.error('Stack:', errorStack);
      }
    }
    this.recordError({
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }
  logWarning(message: string, context?: ErrorContext): void {
    if (this.isDevelopment) {
      console.warn('Ã¢Å¡Â Ã¯Â¸Â WARNING:', message);
      if (context) {
        console.warn('Context:', context);
      }
    }
    this.recordWarning({ message, timestamp: new Date().toISOString(), ...context });
  }
  logInfo(message: string, context?: ErrorContext): void {
    if (this.isDevelopment) {
      console.info('Ã¢â€žÂ¹Ã¯Â¸Â INFO:', message, context);
    }
  }
  private recordError(errorData: any): void {
    if (!this.isDevelopment) {
    }
  }
  private recordWarning(warningData: any): void {
    if (!this.isDevelopment) {
    }
  }
  setUserContext(userId: string, email?: string): void {
    if (this.isDevelopment) {
      console.info('Ã°Å¸â€˜Â¤ User context set:', userId);
    }
  }
  clearUserContext(): void {
    if (this.isDevelopment) {
      console.info('Ã°Å¸â€˜Â¤ User context cleared');
    }
  }
}
export const errorLogger = new ErrorLogger();
export const logAuthError = (error: unknown, action: string) => {
  errorLogger.logError(error, {
    screen: 'Authentication',
    action,
  });
};
export const logFirestoreError = (error: unknown, action: string, collection?: string) => {
  errorLogger.logError(error, {
    screen: 'Database',
    action,
    metadata: { collection },
  });
};
export const logNavigationError = (error: unknown, screen: string) => {
  errorLogger.logError(error, {
    screen: 'Navigation',
    action: `Navigate to ${screen}`,
  });
};
