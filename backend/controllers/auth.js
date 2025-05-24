import jwt from "jsonwebtoken";
import Auth from "../models/auth.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "123";

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await Auth.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      next(error);
    }
  }
  async createDefaltAdmin() {
    try {
      let existingAdmin = await Auth.findOne({ username: DEFAULT_USERNAME });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        await Auth.create({
          username: DEFAULT_USERNAME,
          password: hashedPassword,
        });

        console.log("✅ Default superadmin user created.");
      } else {
        console.log("✅ Superadmin user already exists.");
      }
    } catch (err) {
      console.error("❌ Error initializing default data:", err);
    }
  }
}

export default new AuthController();
