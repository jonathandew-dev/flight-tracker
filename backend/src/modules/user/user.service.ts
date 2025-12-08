import { prisma } from "../../config/db";

export const getAllUsers = () => {
  return prisma.user.findMany({ include: { savedTrips: true } });
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id }, include: { savedTrips: true } });
};

/**
 * Updates a user by id.
 * Only updates provided fields.
 */
export const updateUser = (
  id: string,
  data: { name?: string; email?: string; password?: string }
) => {
  // Filter out undefined fields to prevent accidental null/undefined overwrites
  const filteredData: typeof data = {};
  if (data.name !== undefined) filteredData.name = data.name;
  if (data.email !== undefined) filteredData.email = data.email;
  if (data.password !== undefined) filteredData.password = data.password;

  return prisma.user.update({
    where: { id },
    data: filteredData,
  });
};

export const deleteUser = (id: string) => {
  return prisma.user.delete({ where: { id } });
};