import { Router } from "express";
import * as userController from "./user.controller";
// only user CRUD here
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/me", authMiddleware, userController.updateMe);


export default router;