import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
export const categoryRoutes = Router();
categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", createCategory);
