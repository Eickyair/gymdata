import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import gymRoutes from "./routes/gyms";
import reviewRoutes from "./routes/reviews";

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/gyms", gymRoutes);
app.use("/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gymdb";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default app;
