import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();
const  PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/todos",todoRoutes)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(" Connection error:", err));

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
