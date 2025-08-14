import { Router } from "express";

const router = Router();

router.get("/dashboard", (_req: any, res: any) => {
  res.json({ message: "Admin dashboard - implementation in progress" });
});

export default router;
