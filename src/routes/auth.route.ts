import express from "express";

import {
  getLoggedUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", getLoggedUser);

export default router;
