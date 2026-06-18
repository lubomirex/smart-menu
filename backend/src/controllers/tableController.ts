import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";
import { generateTableQrCode } from "../services/qrCodeService.js";

const tableSchema = z.object({ number: z.number().int().positive(), restaurantId: z.string().uuid() });
const paramId = (req: Request) => z.string().uuid().parse(req.params.id);
export async function getTables(_req: Request, res: Response) { const tables = await prisma.table.findMany({ include: { restaurant: true }, orderBy: { number: "asc" } }); return res.json(tables); }
export async function getTable(req: Request, res: Response) { const table = await prisma.table.findUnique({ where: { id: paramId(req) }, include: { restaurant: true } }); if (!table) return res.status(404).json({ message: "Table not found" }); return res.json(table); }
export async function createTable(req: Request, res: Response) { const data = tableSchema.parse(req.body); const table = await prisma.table.create({ data: { ...data, qrCode: "generating" } }); const qrCode = await generateTableQrCode(table.id); const updated = await prisma.table.update({ where: { id: table.id }, data: { qrCode }, include: { restaurant: true } }); return res.status(201).json(updated); }
