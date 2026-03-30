/**
 * Standardized success response
 */
export const successResponse = (data, message = "Success", status = 200) => ({
  success: true,
  data,
  message,
  status,
});

/**
 * Standardized error response
 */
export const errorResponse = (error, message = "Error occurred", status = 500) => ({
  success: false,
  error: error instanceof Error ? error.message : String(error),
  message,
  status,
});

/**
 * API response formatter for Next.js API routes
 */
export const apiResponse = {
  success: (data, message = "Success", status = 200) => {
    return new Response(
      JSON.stringify(successResponse(data, message, status)),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  
  error: (error, message = "Error occurred", status = 500) => {
    return new Response(
      JSON.stringify(errorResponse(error, message, status)),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

/**
 * Parse query parameters from request
 */
export const parseQueryParams = (request) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const params = {};
  for (const [key, value] of searchParams) {
    // Convert numeric strings to numbers
    params[key] = isNaN(value) ? value : Number(value);
  }
  
  return params;
};

/**
 * Parse pagination parameters with defaults
 */
export const parsePaginationParams = (params) => {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 10)); // Max 100 per page, min 1
  
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * Parse filter parameters
 */
export const parseFilterParams = (params, allowedFilters = []) => {
  const filters = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (allowedFilters.includes(key)) {
      filters[key] = value;
    }
  }
  
  return filters;
};