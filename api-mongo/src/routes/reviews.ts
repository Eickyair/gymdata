import { Router } from "express";
import Review from "../models/Review";
import Gym from "../models/Gym";

const router = Router();

// Crear una reseña
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    // Actualizar promedio y cantidad de reseñas en el gimnasio
    const reviews = await Review.find({ gymId: review.gymId });
    const reviewCount = reviews.length;
    const averageRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviewCount;

    await Gym.findByIdAndUpdate(review.gymId, {
      averageRating,
      reviewCount,
      updatedAt: Date.now(),
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error creando reseña", error });
  }
});

// Obtener reseñas de un gimnasio
router.get("/gym/:gymId", async (req, res) => {
  try {
    // Se puede hacer un lookup para incluir información del usuario (nivel, etc.)
    const reviews = await Review.find({ gymId: req.params.gymId }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo reseñas", error });
  }
});

// Actualizar una reseña (solo autor)
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review)
      return res.status(404).json({ message: "Reseña no encontrada" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando reseña", error });
  }
});

// Eliminar una reseña (solo autor)
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res.status(404).json({ message: "Reseña no encontrada" });

    // Actualizar datos del gimnasio
    const reviews = await Review.find({ gymId: review.gymId });
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviewCount
        : 0;
    await Gym.findByIdAndUpdate(review.gymId, {
      averageRating,
      reviewCount,
      updatedAt: Date.now(),
    });

    res.json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando reseña", error });
  }
});

export default router;
