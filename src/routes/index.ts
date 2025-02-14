import { Router } from "express";
import authRouter from "./auth";

const router = Router();

router.use(authRouter);

router.get("/", (req, res) => {
  res.render("index");
});

export default router;
