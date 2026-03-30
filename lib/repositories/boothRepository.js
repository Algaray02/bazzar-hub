import "server-only";
import { db } from "@/lib/db";
import { BOOTH_SELECT } from "@/lib/prisma/select-config";

export async function createManyBooths(data) {
  await db.booth.createMany({
    data,
  });

  return await db.booth.findMany({
    where: { eventId: data[0].eventId },
    orderBy: { code: "desc" },
    take: data.length,
    select: BOOTH_SELECT,
  });
}

export async function deleteBooth(boothId) {
  return await db.booth.delete({
    where: { id: boothId },
    select: BOOTH_SELECT,
  });
}