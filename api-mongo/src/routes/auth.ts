import { Router } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      provider = "local",
      providerId,
      imagenPerfil,
      role,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "El email ya está registrado" });

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({
      nombre,
      email,
      passwordHash,
      provider,
      providerId,
      imagenPerfil,
      role,
      favoritos: [],
    });
    await user.save();

    res.status(201).json({ message: "Usuario registrado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error registrando usuario", error });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.provider === "local") {
      const isMatch = await bcrypt.compare(password, user.passwordHash || "");
      if (!isMatch)
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.json({ message: "Login exitoso", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
});

export default router;
