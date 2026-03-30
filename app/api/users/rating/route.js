import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all bookings for this user
    const bookings = await db.booking.findMany({
      where: { userId },
      include: {
        reviews: true,
      },
    });

    // Calculate average rating
    let totalRating = 0;
    let reviewCount = 0;

    bookings.forEach((booking) => {
      if (booking.reviews && booking.reviews.length > 0) {
        booking.reviews.forEach((review) => {
          totalRating += review.rating;
          reviewCount += 1;
        });
      }
    });

    const averageRating =
      reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

    return Response.json({
      averageRating: parseFloat(averageRating),
      reviewCount,
      totalRating,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return Response.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}
