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
    const newStation = new Station(req.body);
    await newStation.save();
    res.status(201).json({
      message: "Stansiya yaratildi",
      station: newStation,
    });
  }

  async updateStation(req, res) {
    const updated = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Stansiya topilmadi" });
    res.json({
      message: "Stansiya yangilandi",
      station: updated,
    });
  }

  async deleteStation(req, res) {
    const deleted = await Station.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Stansiya topilmadi" });
    res.json({ message: "O‘chirildi" });
  }
}

export default new StationController();
