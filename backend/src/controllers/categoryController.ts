import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";

const categorySchema = z.object({ name: z.string().min(1), restaurantId: z.string().uuid() });
export async function getCategories(_req: Request, res: Response) { const categories = await prisma.category.findMany({ orderBy: { name: "asc" } }); return res.json(categories); }
export async function createCategory(req: Request, res: Response) { const data = categorySchema.parse(req.body); const category = await prisma.category.create({ data }); return res.status(201).json(category); }
