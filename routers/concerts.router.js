import { Router } from "express";

import { getConcerts } from "../controllers/concerts.controller.js";

const router = Router();

router.get("/getConcerts", getConcerts);

export default router;
