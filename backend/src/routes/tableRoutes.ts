import { Router } from "express";
import { createTable, getTables } from "../controllers/tableController.js";
export const tableRoutes = Router();
tableRoutes.get("/", getTables);
tableRoutes.post("/", createTable);
