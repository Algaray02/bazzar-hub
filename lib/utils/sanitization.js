/**
 * Sanitize string input
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return html;
  // Basic sanitization - in production, use a proper sanitization library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Sanitize object properties
 */
export function sanitizeObject(obj, options = {}) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const { sanitizeHtml: sanitizeHtmlContent = false } = options;
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtmlContent ? sanitizeHtml(value) : sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? (sanitizeHtmlContent ? sanitizeHtml(item) : sanitizeString(item)) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize form data
 */
export function sanitizeFormData(formData, options = {}) {
  const obj = Object.fromEntries(formData.entries());
  return sanitizeObject(obj, options);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitize phone number to Indonesian format
 */
export function sanitizePhone(phone) {
  if (!phone) return phone;
  let sanitized = phone.toString().replace(/\D/g, '');
  
  if (sanitized.startsWith('0')) {
    sanitized = '62' + sanitized.substring(1);
  } else if (sanitized.startsWith('8')) {
    sanitized = '62' + sanitized;
  } else if (sanitized.startsWith('+62')) {
    sanitized = sanitized.substring(1);
  }
  
  return sanitized;
}