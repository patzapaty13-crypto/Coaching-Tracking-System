/**
 * Input Validation Utilities
 * ป้องกัน SQL Injection, XSS, และ input validation
 */

import { sanitizeInput } from './security';

/**
 * Validate and sanitize string input
 */
export function validateString(
  input: unknown,
  options?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    pattern?: RegExp;
    allowHtml?: boolean;
  }
): { isValid: boolean; value: string; error?: string } {
  if (typeof input !== 'string') {
    return { isValid: false, value: '', error: 'Input must be a string' };
  }

  const { minLength, maxLength, required = false, pattern, allowHtml = false } = options || {};

  if (required && input.trim().length === 0) {
    return { isValid: false, value: '', error: 'This field is required' };
  }

  if (minLength && input.length < minLength) {
    return {
      isValid: false,
      value: '',
      error: `Minimum length is ${minLength} characters`,
    };
  }

  if (maxLength && input.length > maxLength) {
    return {
      isValid: false,
      value: '',
      error: `Maximum length is ${maxLength} characters`,
    };
  }

  if (pattern && !pattern.test(input)) {
    return { isValid: false, value: '', error: 'Invalid format' };
  }

  // Sanitize to prevent XSS (unless HTML is explicitly allowed)
  const sanitized = allowHtml ? input : sanitizeInput(input);

  return { isValid: true, value: sanitized };
}

/**
 * Validate number input
 */
export function validateNumber(
  input: unknown,
  options?: {
    min?: number;
    max?: number;
    required?: boolean;
    integer?: boolean;
  }
): { isValid: boolean; value: number; error?: string } {
  const { min, max, required = false, integer = false } = options || {};

  if (input === null || input === undefined || input === '') {
    if (required) {
      return { isValid: false, value: 0, error: 'This field is required' };
    }
    return { isValid: true, value: 0 };
  }

  const num = typeof input === 'number' ? input : Number(input);

  if (isNaN(num)) {
    return { isValid: false, value: 0, error: 'Must be a valid number' };
  }

  if (integer && !Number.isInteger(num)) {
    return { isValid: false, value: 0, error: 'Must be an integer' };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, value: 0, error: `Must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, value: 0, error: `Must be at most ${max}` };
  }

  return { isValid: true, value: num };
}

/**
 * Validate date input
 */
export function validateDate(
  input: unknown,
  options?: {
    min?: Date;
    max?: Date;
    required?: boolean;
  }
): { isValid: boolean; value: Date | null; error?: string } {
  const { min, max, required = false } = options || {};

  if (input === null || input === undefined || input === '') {
    if (required) {
      return { isValid: false, value: null, error: 'This field is required' };
    }
    return { isValid: true, value: null };
  }

  const date = input instanceof Date ? input : new Date(input as string);

  if (isNaN(date.getTime())) {
    return { isValid: false, value: null, error: 'Must be a valid date' };
  }

  if (min && date < min) {
    return { isValid: false, value: null, error: `Date must be after ${min.toLocaleDateString()}` };
  }

  if (max && date > max) {
    return { isValid: false, value: null, error: `Date must be before ${max.toLocaleDateString()}` };
  }

  return { isValid: true, value: date };
}

/**
 * Validate email
 */
export function validateEmailInput(input: unknown): { isValid: boolean; value: string; error?: string } {
  if (typeof input !== 'string') {
    return { isValid: false, value: '', error: 'Email must be a string' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input)) {
    return { isValid: false, value: '', error: 'Invalid email format' };
  }

  // Sanitize email
  const sanitized = sanitizeInput(input.toLowerCase().trim());

  return { isValid: true, value: sanitized };
}

/**
 * Validate URL
 */
export function validateUrl(input: unknown): { isValid: boolean; value: string; error?: string } {
  if (typeof input !== 'string') {
    return { isValid: false, value: '', error: 'URL must be a string' };
  }

  try {
    const url = new URL(input);
    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { isValid: false, value: '', error: 'URL must use http or https protocol' };
    }
    return { isValid: true, value: url.toString() };
  } catch {
    return { isValid: false, value: '', error: 'Invalid URL format' };
  }
}

/**
 * Validate array input
 */
export function validateArray<T>(
  input: unknown,
  options?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    itemValidator?: (item: unknown) => { isValid: boolean; value: T; error?: string };
  }
): { isValid: boolean; value: T[]; error?: string } {
  const { minLength, maxLength, required = false, itemValidator } = options || {};

  if (!Array.isArray(input)) {
    if (required) {
      return { isValid: false, value: [], error: 'Must be an array' };
    }
    return { isValid: true, value: [] };
  }

  if (minLength && input.length < minLength) {
    return { isValid: false, value: [], error: `Must have at least ${minLength} items` };
  }

  if (maxLength && input.length > maxLength) {
    return { isValid: false, value: [], error: `Must have at most ${maxLength} items` };
  }

  if (itemValidator) {
    const validatedItems: T[] = [];
    for (const item of input) {
      const result = itemValidator(item);
      if (!result.isValid) {
        return { isValid: false, value: [], error: result.error };
      }
      validatedItems.push(result.value);
    }
    return { isValid: true, value: validatedItems };
  }

  return { isValid: true, value: input as T[] };
}

