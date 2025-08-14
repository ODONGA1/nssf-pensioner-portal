import { Router } from "express";

const router = Router();

// Placeholder routes
router.get("/profile", (_req: any, res: any) => {
  res.json({ message: "Get pensioner profile - implementation in progress" });
});

router.put("/profile", (_req: any, res: any) => {
  res.json({
    message: "Update pensioner profile - implementation in progress",
  });
});

export default router;
