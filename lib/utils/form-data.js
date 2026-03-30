/**
 * Safe JSON parsing utility
 */
export function safeJsonParse(value, fallback = null) {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Parse organizer data from form input
 */
export function parseOrganizer(organizer) {
  if (!organizer) return null;
  const parsed = safeJsonParse(organizer, null);
  if (parsed && typeof parsed === "object") return parsed;
  if (typeof organizer === "string") {
    return { name: organizer, verified: false };
  }
  return null;
}

/**
 * Parse highlights from form input
 */
export function parseHighlights(highlights) {
  if (!highlights) return [];
  if (Array.isArray(highlights)) return highlights;
  if (typeof highlights === "string") {
    return highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Parse form data entries to object
 */
export function formDataToObject(formData) {
  return Object.fromEntries(formData.entries());
}

/**
 * Parse nested form data with JSON values
 */
export function parseFormDataWithJson(formData) {
  const rawData = formDataToObject(formData);
  
  // Common JSON fields that might need parsing
  const jsonFields = ['rundown', 'faq', 'organizer', 'highlights'];
  
  const parsedData = { ...rawData };
  
  for (const field of jsonFields) {
    if (rawData[field]) {
      parsedData[field] = safeJsonParse(rawData[field]);
    }
  }
  
  return parsedData;
}

/**
 * Sanitize form input values
 */
export function sanitizeInput(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

/**
 * Sanitize entire form object
 */
export function sanitizeFormData(formData) {
  const obj = formDataToObject(formData);
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeInput(value);
  }
  
  return sanitized;
}