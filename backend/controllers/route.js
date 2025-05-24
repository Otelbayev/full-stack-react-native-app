import Route from "../models/route.js";

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
}

export default new RouteController();
