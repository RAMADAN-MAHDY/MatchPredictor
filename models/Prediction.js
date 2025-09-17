import mongoose from"mongoose";

const predictionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  winner: { type: String, required: true },
  score1: { type: Number, required: true },
  score2: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

const predictionModel = mongoose.model("Prediction", predictionSchema);

export default predictionModel;