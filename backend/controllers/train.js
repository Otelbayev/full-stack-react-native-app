import Train from "../models/train.js";

class TrainController {
  async createTrain(req, res) {
    try {
      const newTrain = new Train(req.body);
      await newTrain.save();
      res.status(201).json(newTrain);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async updateTrain(req, res) {
    try {
      const updatedTrain = await Train.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedTrain) return res.status(404).json({ message: "Topilmadi" });
      res.json(updatedTrain);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  async deleteTrain(req, res) {
    try {
      const deletedTrain = await Train.findByIdAndDelete(req.params.id);
      if (!deletedTrain) return res.status(404).json({ message: "Topilmadi" });
      res.json({ message: "Train deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getTrainByRouteId(req, res) {
    try {
      const trains = await Train.find({ route: req.params.id })
        .populate("wagons")
        .populate("route")
        .populate("currentStation");
      if (!trains) return res.status(404).json({ message: "Topilmadi" });
      res.json(trains);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getAllTrains(req, res) {
    try {
      const trains = await Train.find()
        .populate("wagons")
        .populate("route")
        .populate("currentStation");
      res.json(trains);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getTrainById(req, res) {
    const train = await Train.findById(req.params.id)
      .populate("currentStation")
      .populate("route")
      .populate("wagons");

    if (!train) return res.status(404).json({ message: "Topilmadi" });
    res.json(train);
  }
}

export default new TrainController();
