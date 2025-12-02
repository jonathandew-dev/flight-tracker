import { prisma } from '../../config/db'


export const getAllUsers = () => {
  return prisma.user.findMany({ include: { savedTrips: true } });
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id }, include: { savedTrips: true } });
};

export const updateUser = (id: string, data: { name?: string; email?: string; password?: string }) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = (id: string) => {
  return prisma.user.delete({ where: { id } });
};