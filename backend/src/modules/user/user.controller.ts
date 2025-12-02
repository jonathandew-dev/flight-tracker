import { Request, Response } from "express";
import * as userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

// GET /users
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ users });
});

// GET /users/:id
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ user });
});

// PUT /users/:id
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ user });
});

// DELETE /users/:id
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
});
