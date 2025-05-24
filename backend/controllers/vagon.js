import Vagon from "../models/vagon.js";

class VagonController {
  async getAllVagons(req, res) {
    const vagons = await Vagon.find();
    res.json(vagons);
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
