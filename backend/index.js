import express from "express";
import mongoose from "mongoose";
import authController from "./controllers/auth.js";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use("/api", routes);

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 1604;
    mongoose.connect(process.env.MONGO_URI).then(async () => {
      console.log("Connected to mongodb");
      await authController.createDefaltAdmin();
    });

    app.listen(PORT, () => {
      console.log(`Server is running ${PORT} PORT`);
    });
  } catch (e) {
    console.log("MongoDB error " + e);
  }
};

bootstrap();
