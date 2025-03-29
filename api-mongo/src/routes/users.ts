import { Router } from "express";
import User from "../models/User";

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error });
  }
});

// Obtener un usuario específico por ID
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error obteniendo usuario", error });
    });
});

// Actualizar perfil de usuario
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando usuario", error });
  }
});

export default router;
