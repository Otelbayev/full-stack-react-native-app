import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stations: [
    {
      stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station", // bu stansiyalar modeliga referens bo'ladi
        required: true,
      },
      order: {
        type: Number, // bu stansiya nechinchi bo'lib kelyapti (1, 2, 3...)
        required: true,
      },
    },
  ],
  distance: {
    type: Number,
    default: 0,
  },
  estimatedTime: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Route = mongoose.model("Route", routeSchema);
export default Route;
