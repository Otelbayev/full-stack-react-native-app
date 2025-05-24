import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    openedYear: { type: Number },
    platforms: { type: Number, default: 2 },
    isActive: { type: Boolean, default: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

stationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", stationSchema);
