import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// ==============================
// CORS Configuration
// ==============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.onrender.com", // 🔁 replace after frontend deploy
    ],
    credentials: true,
  })
);

// ==============================
// Test Route
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "Server is running successfully 🚀",
  });
});

// ==============================
// Routes
// ==============================
import userRouter from "./user/userRoutes.js";
import TransactionRouter from "./transaction/transactionRoute.js";
import DashboardRouter from "./dash_board/dash_board.route.js";

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/dash_board", DashboardRouter);

// ==============================
// PORT Configuration
// ==============================
const PORT = process.env.PORT || 8080;

// ==============================
// Database + Server Start
// ==============================
if (!process.env.DB_URL) {
  console.error("❌ DB_URL is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });