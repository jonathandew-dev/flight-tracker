import { Router } from "express";
import * as userController from "./user.controller";
// only user CRUD here
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.patch("/me", authMiddleware, userController.updateMe);

// Other routes (optional)
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);


export default router;