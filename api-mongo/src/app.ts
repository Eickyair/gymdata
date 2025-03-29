import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import gymRoutes from "./routes/gyms";
import reviewRoutes from "./routes/reviews";
import dotenv from "dotenv";
import { authenticateJWT } from "./middlewares/authenticateJWT";
dotenv.config();
const PUBLIC_ROUTES = ["/auth", "/live"];
const app = express();
// Middleware para parsear JSON
app.use(express.json());

// Rutas de autenticación: login y registro (públicas)
app.use("/auth", authRoutes);

// Middleware para proteger las siguientes rutas
app.use((req, res, next) => {
  // Si la petición es hacia rutas públicas (p.ej., /auth), omitir verificación.
  if (PUBLIC_ROUTES.some((route) => req.path.startsWith(route))) {
    return next();
  }
  // Verificar antes el toke
  authenticateJWT(req, res, next);
});

// Rutas protegidas
app.use("/users", userRoutes);
app.use("/gyms", gymRoutes);
app.use("/reviews", reviewRoutes);
app.get("/live", (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = formatUptime(uptime);
  const currentTime = new Date().toISOString();

  res.json({
    status: "ok",
    uptime: uptimeFormatted,
    currentTime: currentTime,
  });
});

function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / (60 * 60 * 24));
  uptime %= 60 * 60 * 24;
  const hours = Math.floor(uptime / (60 * 60));
  uptime %= 60 * 60;
  const minutes = Math.floor(uptime / 60);
  const seconds = Math.floor(uptime % 60);

  let formattedUptime = "";
  if (days > 0) formattedUptime += `${days}d `;
  if (hours > 0) formattedUptime += `${hours}h `;
  if (minutes > 0) formattedUptime += `${minutes}m `;
  formattedUptime += `${seconds}s`;

  return formattedUptime;
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
console.log(PORT, MONGO_URI);

function main() {
  mongoose
    .connect(MONGO_URI, { dbName: "gymdata" })
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

main();
