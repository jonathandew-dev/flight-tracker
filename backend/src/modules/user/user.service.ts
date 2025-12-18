import { prisma } from "../../config/db.js";

export const getAllUsers = () => {
  return prisma.user.findMany({ include: { savedTrips: true } });
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { savedTrips: true },
  });
};

/**
 * Updates a user by id.
 * Only updates provided fields.
 */
export const updateUser = (
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }
) => {
  // Filter out undefined fields
  const filteredData: typeof data = {};
  if (data.firstName !== undefined) filteredData.firstName = data.firstName;
  if (data.lastName !== undefined) filteredData.lastName = data.lastName;
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
