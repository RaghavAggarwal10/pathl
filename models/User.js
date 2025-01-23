import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdDate: { type: Date, default: Date.now() },
});

export default mongoose.model("User", userSchema);
