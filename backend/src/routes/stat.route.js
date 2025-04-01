import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getStats);
console.log("Stats route registered at /api/stats");
export default router;
