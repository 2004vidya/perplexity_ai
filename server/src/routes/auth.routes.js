import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import validateRegister from "../validators/auth.validator.js";

const authRoutes = Router();

authRoutes.post("/register",validateRegister,registerUser)

export default authRoutes;