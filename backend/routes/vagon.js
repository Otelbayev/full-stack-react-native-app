import { Router } from "express";
import VagonController from "../controllers/vagon.js";

const router = Router();

router.get("/search/:code", VagonController.getDataByCode);
router.get("/", VagonController.getAllVagons);
router.get("/:id", VagonController.getVagonById);
router.post("/", VagonController.createVagon);
router.put("/:id", VagonController.updateVagon);
router.delete("/:id", VagonController.deleteVagon);

export default router;
