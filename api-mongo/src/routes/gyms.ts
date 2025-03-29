import { Router } from "express";
import Gym from "../models/Gym";

const router = Router();

// Crear un gimnasio (solo dueño)
router.post("/", async (req, res) => {
  try {
    const gym = new Gym(req.body);
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    res.status(500).json({ message: "Error creando gimnasio", error });
  }
});

// Obtener todos los gimnasios
router.get("/", async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo gimnasios", error });
  }
});

// Obtener un gimnasio por ID
router.get("/:id", async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym)
      return res.status(404).json({ message: "Gimnasio no encontrado" });
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo gimnasio", error });
  }
});

// Actualizar un gimnasio
router.put("/:id", async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!gym)
      return res.status(404).json({ message: "Gimnasio no encontrado" });
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando gimnasio", error });
  }
});

// Eliminar un gimnasio
router.delete("/:id", async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    if (!gym)
      return res.status(404).json({ message: "Gimnasio no encontrado" });
    res.json({ message: "Gimnasio eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando gimnasio", error });
  }
});

export default router;
