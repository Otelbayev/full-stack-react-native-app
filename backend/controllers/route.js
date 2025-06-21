import Route from "../models/route.js";
import Station from "../models/station.js";
import Vagon from "../models/vagon.js";
import Train from "../models/train.js";

class RouteController {
  async createRoute(req, res) {
    try {
      const route = new Route(req.body);
      await route.save();
      res.status(201).json(route);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async getRoutes(req, res) {
    try {
      const routes = await Route.find();
      res.status(200).json(routes);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async getRouteById(req, res) {
    try {
      const route = await Route.findById(req.params.id);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.status(200).json(route);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async updateRoute(req, res) {
    try {
      const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.status(200).json(route);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async deleteRoute(req, res) {
    try {
      const route = await Route.findByIdAndDelete(req.params.id);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.status(200).json({ message: "Route deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const [
        totalWagons,
        workingWagons,
        totalStations,
        activeStations,
        totalTrains,
        onRoute,
        arrived,
        totalRoutes,
        recentTrains,
      ] = await Promise.all([
        Vagon.countDocuments(),
        Vagon.countDocuments({ isOperational: true }),
        Station.countDocuments(),
        Station.countDocuments({ isActive: true }),
        Train.countDocuments(),
        Train.countDocuments({ status: "yo‘lda" }),
        Train.countDocuments({ status: "yetib keldi" }),
        Route.countDocuments(),
        Train.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("currentStation", "name"),
      ]);

      res.json({
        totalWagons,
        workingWagons,
        totalStations,
        activeStations,
        totalTrains,
        onRoute,
        arrived,
        totalRoutes,
        recentTrains: recentTrains.map((train) => ({
          name: train.name,
          status: train.status,
          departureTime: train.departureTime,
          currentStationName: train.currentStation?.name || null,
        })),
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res
        .status(500)
        .json({ error: "Ma'lumotlarni olishda xatolik yuz berdi" });
    }
  }
}

export default new RouteController();
