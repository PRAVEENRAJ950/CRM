import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: { type: String, unique: true },
  phone: String,
  source: String,
  password: String,
  role: String,
});

export default mongoose.model("User", userSchema);
