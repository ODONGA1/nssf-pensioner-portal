import { Router } from "express";

const router = Router();

router.get("/", (_req: any, res: any) => {
  res.json({ message: "Get payments - implementation in progress" });
});

export default router;
