import { Schema, model, Document } from "mongoose";

export interface IGym extends Document {
  nombre: string;
  descripcion: string;
  direccion: string;
  ubicacion: {
    type: string;
    coordinates: number[];
  };
  precio: number | string;
  actividades: string[];
  servicios: string[];
  imagenes: string[];
  contacto: {
    telefono?: string;
    emailContacto?: string;
    web?: string;
    instagram?: string;
  };
  ownerId: Schema.Types.ObjectId;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const GymSchema = new Schema<IGym>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  direccion: { type: String },
  ubicacion: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  precio: { type: Schema.Types.Mixed },
  actividades: [{ type: String }],
  servicios: [{ type: String }],
  imagenes: [{ type: String }],
  contacto: {
    telefono: { type: String },
    emailContacto: { type: String },
    web: { type: String },
    instagram: { type: String },
  },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Índices recomendados
GymSchema.index({ ubicacion: "2dsphere" });
GymSchema.index({ ownerId: 1 });
GymSchema.index({ averageRating: 1 });

export default model<IGym>("Gym", GymSchema);
