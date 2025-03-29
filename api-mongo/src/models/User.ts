import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  email: string;
  passwordHash?: string;
  provider: string;
  providerId?: string;
  imagenPerfil?: string;
  favoritos: Schema.Types.ObjectId[];
  role: "user" | "owner";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  provider: { type: String, required: true, default: "local" },
  providerId: { type: String },
  imagenPerfil: { type: String },
  favoritos: [{ type: Schema.Types.ObjectId, ref: "Gym" }],
  role: { type: String, enum: ["user", "owner"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

export default model<IUser>("User", UserSchema);
