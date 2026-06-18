import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";

const productSchema = z.object({ name: z.string().min(1), description: z.string().min(1), price: z.coerce.number().positive(), imageUrl: z.string().url(), available: z.boolean().default(true), categoryId: z.string().uuid() });
const serializeProduct = <T extends { price: unknown }>(product: T) => ({ ...product, price: Number(product.price) });

export async function getProducts(_req: Request, res: Response) { const products = await prisma.product.findMany({ include: { category: true }, orderBy: { name: "asc" } }); return res.json(products.map(serializeProduct)); }
export async function getProduct(req: Request, res: Response) { const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } }); if (!product) return res.status(404).json({ message: "Product not found" }); return res.json(serializeProduct(product)); }
export async function createProduct(req: Request, res: Response) { const data = productSchema.parse(req.body); const product = await prisma.product.create({ data, include: { category: true } }); return res.status(201).json(serializeProduct(product)); }
export async function updateProduct(req: Request, res: Response) { const data = productSchema.partial().parse(req.body); const product = await prisma.product.update({ where: { id: req.params.id }, data, include: { category: true } }); return res.json(serializeProduct(product)); }
export async function deleteProduct(req: Request, res: Response) { await prisma.product.delete({ where: { id: req.params.id } }); return res.status(204).send(); }
