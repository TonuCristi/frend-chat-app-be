import { Router } from "express";

import { createChat } from "../controllers/chats.controller.js";

const router = Router();

router.post("/", createChat);

export default router;
