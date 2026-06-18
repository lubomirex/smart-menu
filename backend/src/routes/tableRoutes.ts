import { Router } from "express";
import { createTable, getTable, getTables } from "../controllers/tableController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

export const tableRoutes = Router();

tableRoutes.get("/", requireAdmin, getTables);
tableRoutes.get("/:id", getTable);
tableRoutes.post("/", requireAdmin, createTable);
