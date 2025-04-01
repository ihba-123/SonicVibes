import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Log when admin.route.js is loaded
console.log("admin.route.js loaded");

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

// Log all routes registered in admin.route.js
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route registered in admin.route.js: ${r.route.path} (${Object.keys(r.route.methods).join(", ")})`);
  }
});

export default router;