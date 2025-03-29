import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// Augment the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Or specify the type of your user object
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Se espera el formato: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }
      // Puedes asignar el payload decodificado al request para uso posterior
      req.user = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ message: "No autorizado: Token no proporcionado" });
  }
};
