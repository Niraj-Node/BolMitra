import express from "express";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true               // allow cookies (access_token)
}))

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send("Working");
});

// Connect to Database
connectDB();

// Routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});