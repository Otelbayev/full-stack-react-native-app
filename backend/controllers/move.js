import Train from "../models/train.js";
import Route from "../models/route.js";

export const moveTrainToNextStation = async (req, res) => {
  try {
    const { trainId } = req.params;
    const train = await Train.findById(trainId)
      .populate("route")
      .populate("currentStation");

    if (!train) return res.status(404).json({ message: "Poezd topilmadi" });

    const route = await Route.findById(train.route._id).populate(
      "stations.station"
    );
    const stationList = route.stations.sort((a, b) => a.order - b.order);

    // Hozirgi stansiya indexini topamiz
    const currentIndex = train.currentStation
      ? stationList.findIndex(
          (s) =>
            s.station._id.toString() === train.currentStation._id.toString()
        )
      : -1;

    // Keyingi stansiya mavjudligini tekshiramiz
    const nextIndex = currentIndex + 1;

    if (nextIndex >= stationList.length) {
      train.status = "yetib keldi";
      train.currentStation = null;
      await train.save();
      return res.json({ message: "Poezd marshrut oxiriga yetib keldi", train });
    }

    // Keyingi stansiyaga o‘tamiz
    train.currentStation = stationList[nextIndex].station._id;
    train.status = "yo‘lda";
    train.departureTime = new Date();
    await train.save();

    res.json({ message: "Poezd keyingi stansiyaga jo‘natildi", train });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
