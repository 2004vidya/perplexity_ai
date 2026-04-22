import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chatRoutes from "./routes/chat.routes.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));

// Set relaxed CSP for development
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval';");
  next();
});

app.use(express.static(path.join(__dirname, "..", "dist")));
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

export default app;
