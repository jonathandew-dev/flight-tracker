import { Router } from "express";

import { registerUserController,loginUserController,getMeController } from "./auth.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/me",getMeController );

export default router;

