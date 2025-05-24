import { moveTrainToNextStation } from "../controllers/move.js";
import { Router } from "express";

const router = Router();

router.put("/:trainId/next", moveTrainToNextStation);

export default router;
