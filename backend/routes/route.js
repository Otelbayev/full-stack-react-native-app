import { Router } from "express";
import RouteController from "../controllers/route.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, RouteController.createRoute);
router.get("/", authMiddleware, RouteController.getRoutes);
router.get("/:id", authMiddleware, RouteController.getRouteById);
router.put("/:id", authMiddleware, RouteController.updateRoute);
router.delete("/:id", authMiddleware, RouteController.deleteRoute);

export default router;
