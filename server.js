import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import Prediction from "./models/Prediction.js";
import { connectDB } from "./config/db.js";

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// إعداد الـ views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.render("index");
  } catch (err) {
    res.status(500).send("DB connection failed");
  }
});

app.get("/results", async (req, res) => {
  try {
    await connectDB();
    const predictions = await Prediction.find().sort({ time: -1 });
    res.render("results", { predictions });
  } catch (err) {
    res.status(500).send("DB connection failed");
  }
});

// API (بديل backend.php)
app.get("/api/predictions", async (req, res) => {
  try {
    await connectDB();
    const predictions = await Prediction.find().sort({ time: -1 });
    res.json({ records: predictions });
  } catch (err) {
    res.status(500).json({ result: "error", message: "DB connection failed" });
  }
});

app.post("/api/predictions", async (req, res) => {
  const { name, winner, score1, score2 } = req.body;

  if (!name || !winner || score1 === undefined || score2 === undefined) {
    return res.status(400).json({ result: "error", message: "بيانات ناقصة" });
  }

  try {
    await connectDB();
    const newPrediction = new Prediction({ name, winner, score1, score2 });
    await newPrediction.save();
    res.json({ result: "success" });
  } catch (err) {
    res.status(500).json({ result: "error", message: "فشل الحفظ" });
  }
});

// start server (فقط لو بتشغل محلي)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
