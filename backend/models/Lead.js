import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  phone: String,
  source: String,
  status: String,
});

export default mongoose.model("Lead", leadSchema);
