export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  return { isValid: true };
};
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, and number'
    };
  }
  return { isValid: true };
};
export const validateListName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'List name is required' };
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'List name must be at least 2 characters' };
  }
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'List name is too long (max 100 characters)' };
  }
  const dangerousPatterns = /<script|javascript:|on\w+=/i;
  if (dangerousPatterns.test(trimmedName)) {
    return { isValid: false, error: 'List name contains invalid characters' };
  }
  return { isValid: true };
};
export const validateListItem = (item: string): ValidationResult => {
  if (!item || item.trim().length === 0) {
    return { isValid: false, error: 'Item cannot be empty' };
  }
  const trimmedItem = item.trim();
  if (trimmedItem.length > 200) {
    return { isValid: false, error: 'Item name is too long (max 200 characters)' };
  }
  const dangerousPatterns = /<script|javascript:|on\w+=/i;
  if (dangerousPatterns.test(trimmedItem)) {
    return { isValid: false, error: 'Item contains invalid characters' };
  }
  return { isValid: true };
};
export const validateTag = (tag: string): ValidationResult => {
  if (!tag || tag.trim().length === 0) {
    return { isValid: false, error: 'Tag cannot be empty' };
  }
  const trimmedTag = tag.trim();
  if (trimmedTag.length > 50) {
    return { isValid: false, error: 'Tag is too long (max 50 characters)' };
  }
  const validTagPattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validTagPattern.test(trimmedTag)) {
    return { isValid: false, error: 'Tag contains invalid characters' };
  }
  return { isValid: true };
};
export const validateItemsArray = (items: string[]): ValidationResult => {
  if (!Array.isArray(items)) {
    return { isValid: false, error: 'Items must be an array' };
  }
  if (items.length === 0) {
    return { isValid: false, error: 'At least one item is required' };
  }
  if (items.length > 500) {
    return { isValid: false, error: 'Too many items (max 500)' };
  }
  const nonEmptyItems = items.filter(item => item && item.trim().length > 0);
  if (nonEmptyItems.length === 0) {
    return { isValid: false, error: 'At least one non-empty item is required' };
  }
  for (const item of nonEmptyItems) {
    const itemValidation = validateListItem(item);
    if (!itemValidation.isValid) {
      return itemValidation;
    }
  }
  return { isValid: true };
};
export const validateTagsArray = (tags: string[]): ValidationResult => {
  if (!Array.isArray(tags)) {
    return { isValid: false, error: 'Tags must be an array' };
  }
  if (tags.length > 20) {
    return { isValid: false, error: 'Too many tags (max 20)' };
  }
  for (const tag of tags) {
    const tagValidation = validateTag(tag);
    if (!tagValidation.isValid) {
      return tagValidation;
    }
  }
  return { isValid: true };
};
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};
export const validateDisplayName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Name is too long (max 50 characters)' };
  }
  const validNamePattern = /^[a-zA-Z\s\-'.]+$/;
  if (!validNamePattern.test(trimmedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }
  return { isValid: true };
};
export const isLikelySpam = (text: string): boolean => {
  if (!text) return false;
  const specialCharCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialCharCount > text.length * 0.5) return true;
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 3) return true;
  const upperCaseCount = (text.match(/[A-Z]/g) || []).length;
  if (upperCaseCount > text.length * 0.7) return true;
  return false;
};
