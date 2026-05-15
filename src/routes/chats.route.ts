import { Router } from "express";

import { createChat, getChats } from "../controllers/chats.controller.js";

const router = Router();

router.post("/", createChat);

router.get("/", getChats);

export default router;
