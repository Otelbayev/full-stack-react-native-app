import { Router } from "express";
import TrainController from "../controllers/train.js";

const router = Router();

router.get("/", TrainController.getAllTrains);
router.post("/", TrainController.createTrain);
router.get("/:id", TrainController.getTrainById);
router.put("/:id", TrainController.updateTrain);
router.delete("/:id", TrainController.deleteTrain);

export default router;
