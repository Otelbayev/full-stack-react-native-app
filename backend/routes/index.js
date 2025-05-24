import { Router } from "express";
import authRouter from "./auth.js";
import vagonRouter from "./vagon.js";
import stationRouter from "./station.js";
import routeRouter from "./route.js";
import trainRouter from "./train.js";
import moveRouter from "./move.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/vagon", vagonRouter);
router.use("/station", stationRouter);
router.use("/route", routeRouter);
router.use("/train", trainRouter);
router.use("/move", moveRouter);

export default router;
