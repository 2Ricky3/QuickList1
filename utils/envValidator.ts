interface EnvConfig {
  EXPO_PUBLIC_FIREBASE_API_KEY?: string;
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  EXPO_PUBLIC_FIREBASE_PROJECT_ID?: string;
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  EXPO_PUBLIC_FIREBASE_APP_ID?: string;
}
interface ValidationError {
  variable: string;
  message: string;
}
class EnvironmentValidator {
  private errors: ValidationError[] = [];
  validate(): boolean {
    this.errors = [];
    const requiredVars: (keyof EnvConfig)[] = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'EXPO_PUBLIC_FIREBASE_APP_ID',
    ];
    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (!value || value.trim().length === 0) {
        this.errors.push({
          variable: varName,
          message: `${varName} is not set or is empty`,
        });
      } else {
        this.validateVariable(varName, value);
      }
    }
    return this.errors.length === 0;
  }
  private validateVariable(name: keyof EnvConfig, value: string): void {
    switch (name) {
      case 'EXPO_PUBLIC_FIREBASE_API_KEY':
        if (value.length < 20) {
          this.errors.push({
            variable: name,
            message: 'Firebase API key appears to be invalid (too short)',
          });
        }
        break;
      case 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN':
        if (!value.includes('.firebaseapp.com')) {
          this.errors.push({
            variable: name,
            message: 'Firebase auth domain should end with .firebaseapp.com',
          });
        }
        break;
      case 'EXPO_PUBLIC_FIREBASE_PROJECT_ID':
        if (!/^[a-z0-9-]+$/.test(value)) {
          this.errors.push({
            variable: name,
            message: 'Firebase project ID contains invalid characters',
          });
        }
        break;
      case 'EXPO_PUBLIC_FIREBASE_APP_ID':
        if (!value.startsWith('1:')) {
          this.errors.push({
            variable: name,
            message: 'Firebase app ID format appears incorrect',
          });
        }
        break;
    }
  }
  getErrors(): ValidationError[] {
    return this.errors;
  }
  getErrorMessage(): string {
    if (this.errors.length === 0) {
      return '';
    }
    const errorList = this.errors
      .map(err => `  Ã¢â‚¬Â¢ ${err.variable}: ${err.message}`)
      .join('\n');
    return `Ã°Å¸â€Â´ Environment Configuration Errors:\n\n${errorList}\n\n` +
           `Please check your .env file and ensure all Firebase ` +
           `configuration values are set correctly.`;
  }
  isDevelopment(): boolean {
    return __DEV__;
  }
  isProduction(): boolean {
    return !__DEV__;
  }
}
export const envValidator = new EnvironmentValidator();
export const validateEnvironment = (): void => {
  const isValid = envValidator.validate();
  if (!isValid) {
    const errorMessage = envValidator.getErrorMessage();
    console.error(errorMessage);
    if (__DEV__) {
      console.warn('Ã¢Å¡Â Ã¯Â¸Â App will continue with errors in development mode');
    } else {
      throw new Error(
        'Critical environment configuration error. App cannot start.\n' +
        errorMessage
      );
    }
  } else {
    console.log('Ã¢Å“â€¦ Environment configuration validated successfully');
  }
};
export const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missingKeys.join(', ')}`
    );
  }
  return config;
};
