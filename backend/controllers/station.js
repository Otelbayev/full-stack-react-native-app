import Station from "../models/station.js";

class StationController {
  async getAllStations(req, res) {
    const stations = await Station.find();
    res.json(stations);
  }

  async getStationById(req, res) {
    const station = await Station.findById(req.params.id);
    if (!station)
      return res.status(404).json({ message: "Stansiya topilmadi" });
    res.json(station);
  }

  async createStation(req, res) {
    try {
      const newStation = new Station(req.body);
      await newStation.save();
      res.status(201).json({
        message: "Stansiya yaratildi",
        station: newStation,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateStation(req, res) {
    try {
      const updated = await Station.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Stansiya topilmadi" });
      res.json({
        message: "Stansiya yangilandi",
        station: updated,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteStation(req, res) {
    try {
      const deleted = await Station.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Stansiya topilmadi" });
      res.json({ message: "O‘chirildi" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new StationController();
