/**
 * Standardized error response
 */
export function errorResponse(error, message = "An error occurred", status = 500) {
  return {
    success: false,
    error: error instanceof Error ? error.message : String(error),
    message,
    status
  };
}

/**
 * Success response
 */
export function successResponse(data, message = "Success", status = 200) {
  return {
    success: true,
    data,
    message,
    status
  };
}

/**
 * Handle errors in action functions
 */
export async function handleAction(actionFn) {
  try {
    const result = await actionFn();
    return result;
  } catch (error) {
    console.error("Action error:", error);
    return errorResponse(error, error.message || "Action failed");
  }
}

/**
 * Handle errors in service functions
 */
export async function handleService(serviceFn) {
  try {
    return await serviceFn();
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
}

/**
 * Parse and format Zod validation errors
 */
export function formatZodErrors(zodError) {
  if (zodError && zodError.errors) {
    return zodError.errors.map(err => err.message).join(', ');
  }
  return zodError.message;
}

/**
 * Validate input with Zod schema
 */
export function validateWithSchema(data, schema) {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error(formatZodErrors(error));
  }
}