import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  gymId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  comentario: string;
  imagenes: string[];
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  gymId: {
    type: Schema.Types.ObjectId,
    ref: "Gym",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, maxlength: 100 },
  imagenes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IReview>("Review", ReviewSchema);
