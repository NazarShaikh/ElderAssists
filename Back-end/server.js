  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";

  import connectDB from "./config/db.js";
  import authRoutes from "./routes/authRoutes.js";
  import requestRoutes from "./routes/requestRoutes.js";
  import helperRoutes from "./routes/helperRoutes.js";
  import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/UserRoutes.js";


dotenv.config();

// CONNECT DATABASE
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES

  app.use("/api/auth", authRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

  // routes
  app.use("/api/helpers", helperRoutes);
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });