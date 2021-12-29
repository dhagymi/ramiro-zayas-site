import { Router } from "express";

import mailRouter from "./mail.router.js";
import concertsRouter from "./concerts.router.js";

const router = Router();

router.use("/mail", mailRouter);
router.use("/concerts", concertsRouter);

export default router;
