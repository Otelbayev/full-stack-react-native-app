import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  wagons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vagon",
      required: true,
    },
  ],
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  currentStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    default: null,
  },
  status: {
    type: String,
    enum: ["kutmoqda", "yo‘lda", "yetib keldi"],
    default: "kutmoqda",
  },
  departureTime: {
    type: Date,
    default: null,
  },
  arrivalTime: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Train = mongoose.model("Train", trainSchema);
export default Train;
