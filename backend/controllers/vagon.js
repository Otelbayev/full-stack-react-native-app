import Train from "../models/train.js";
import Vagon from "../models/vagon.js";

class VagonController {
  async getAllVagons(req, res) {
    const vagons = await Vagon.find();
    res.json(vagons);
  }

  async getDataByCode(req, res) {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({ error: "Vagon code is required" });
      }

      const vagon = await Vagon.findOne({ number: Number(code) });
      if (!vagon) {
        return res.status(404).json({ error: "Vagon not found" });
      }

      const train = await Train.findOne({ wagons: vagon._id })
        .populate({
          path: "route",
          populate: {
            path: "stations.stationId",
            model: "Station",
          },
        })
        .populate("currentStation")
        .populate("wagons");

      res.json({
        vagon,
        train,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }

  async getVagonById(req, res) {
    const vagon = await Vagon.findById(req.params.id);
    if (!vagon) return res.status(404).json({ message: "Vagon topilmadi" });
    res.json(vagon);
  }

  async createVagon(req, res) {
    const newVagon = new Vagon(req.body);
    await newVagon.save();
    res.status(201).json({
      message: "Vagon yaratildi",
      vagon: newVagon,
    });
  }

  async updateVagon(req, res) {
    const updated = await Vagon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Vagon topilmadi" });
    res.json({
      message: "Vagon yangilandi",
      vagon: updated,
    });
  }

  async deleteVagon(req, res) {
    const deleted = await Vagon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Vagon topilmadi" });
    res.json({ message: "Ochirildi" });
  }
}

export default new VagonController();
