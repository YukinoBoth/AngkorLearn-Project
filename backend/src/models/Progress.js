import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  math: { type: Object, default: {} },
  physics: { type: Object, default: {} },
  chemistry: { type: Object, default: {} },
  biology: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
