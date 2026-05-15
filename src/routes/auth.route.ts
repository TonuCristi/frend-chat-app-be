import { Router } from "express";

import {
  getLoggedUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, getLoggedUser);

export default router;
