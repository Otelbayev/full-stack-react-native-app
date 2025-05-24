import mongoose from "mongoose";

const vagonSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    capacityTons: { type: Number, required: true },
    volumeM3: { type: Number },
    axles: { type: Number, default: 4 },
    yearBuilt: { type: Number },
    owner: { type: String },
    lastInspection: { type: Date },
    isOperational: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vagon", vagonSchema);
