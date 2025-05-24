import { Router } from "express";
import VagonController from "../controllers/vagon.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, VagonController.getAllVagons);
router.get("/:id", authMiddleware, VagonController.getVagonById);
router.post("/", authMiddleware, VagonController.createVagon);
router.put("/:id", authMiddleware, VagonController.updateVagon);
router.delete("/:id", authMiddleware, VagonController.deleteVagon);

export default router;
