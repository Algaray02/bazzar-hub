/**
 * Handle common Prisma errors and convert them to user-friendly messages
 */
export function handlePrismaError(error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    return new Error('Data sudah ada. Silakan coba dengan nilai yang berbeda.');
  } else if (error.code === 'P2025') {
    // Record not found
    return new Error('Data tidak ditemukan.');
  } else if (error.code === 'P2003') {
    // Foreign key constraint violation
    return new Error('Data tidak dapat disimpan karena ada referensi yang tidak valid.');
  } else {
    console.error('Prisma error:', error);
    return new Error('Terjadi kesalahan pada database. Silakan coba lagi nanti.');
  }
}

/**
 * Safely execute Prisma operations with error handling
 */
export async function safePrismaOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    throw handlePrismaError(error);
  }
}