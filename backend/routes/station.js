import { Router } from "express";
import StationController from "../controllers/station.js";

const router = Router();

router.get("/", StationController.getAllStations);
router.get("/:id", StationController.getStationById);
router.post("/", StationController.createStation);
router.put("/:id", StationController.updateStation);
router.delete("/:id", StationController.deleteStation);

export default router;
