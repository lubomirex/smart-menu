import { Router } from "express";
import { createOrder, getOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
export const orderRoutes = Router();
orderRoutes.get("/", getOrders);
orderRoutes.get("/:id", getOrder);
orderRoutes.post("/", optionalAuth, createOrder);
orderRoutes.put("/:id/status", updateOrderStatus);
