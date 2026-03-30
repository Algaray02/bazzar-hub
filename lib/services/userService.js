import "server-only";
import bcrypt from "bcryptjs";
import * as userRepository from "@/lib/repositories/userRepository";

export async function getUserProfile(userId) {
  return await userRepository.findUserById(userId);
}

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password || "password123", 10);

  return await userRepository.createUser({
    ...data,
    password: hashedPassword,
  });
}

export async function updateUser(userId, data) {
  return await userRepository.updateUser(userId, data);
}

export async function updateProfile(userId, data) {
  return await userRepository.updateUser(userId, data);
}

export async function getAllUsers(options = {}) {
  return await userRepository.findManyUsers(options);
}

export async function getUserWithStats(userId) {
  return await userRepository.findUserWithStats(userId);
}

export async function deleteUser(userId) {
  return await userRepository.deleteUser(userId);
}

export async function getUserBookings(userId, status = null) {
  return await userRepository.findUserBookings(userId, status);
}