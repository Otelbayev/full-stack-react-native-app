import { Router } from "express";
import RouteController from "../controllers/route.js";

const router = Router();

router.get("/stats", RouteController.getStats);
router.post("/", RouteController.createRoute);
router.get("/", RouteController.getRoutes);
router.get("/:id", RouteController.getRouteById);
router.put("/:id", RouteController.updateRoute);
router.delete("/:id", RouteController.deleteRoute);

export default router;
