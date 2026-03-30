import "server-only";
import { v4 as uuidv4 } from "uuid";
import * as boothRepository from "@/lib/repositories/boothRepository";

export async function createBulkBooths(eventId, quantity, price) {
  const boothsData = Array.from({ length: quantity }).map(() => ({
    code: uuidv4(),
    price: price,
    eventId: eventId,
  }));

  return await boothRepository.createManyBooths(boothsData);
}

export async function deleteBooth(boothId) {
  return await boothRepository.deleteBooth(boothId);
}