import { Router } from "express";
import StationController from "../controllers/station.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, StationController.getAllStations);
router.get("/:id", authMiddleware, StationController.getStationById);
router.post("/", authMiddleware, StationController.createStation);
router.put("/:id", authMiddleware, StationController.updateStation);
router.delete("/:id", authMiddleware, StationController.deleteStation);

export default router;
