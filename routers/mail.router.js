import { Router } from "express";

import { sendContactFormEmail } from "../controllers/mail.controller.js";

const router = Router();

router.post("/contact", sendContactFormEmail);

export default router;
