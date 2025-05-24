import { Router } from "express";
import TrainController from "../controllers/train.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, TrainController.getAllTrains);
router.post("/", authMiddleware, TrainController.createTrain);
router.get("/:id", authMiddleware, TrainController.getTrainById);
router.put("/:id", authMiddleware, TrainController.updateTrain);
router.delete("/:id", authMiddleware, TrainController.deleteTrain);

export default router;
