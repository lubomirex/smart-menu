import type { Request, Response } from "express";
import { OrderStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma/client.js";

const orderSchema = z.object({ customerId: z.string().uuid().optional(), tableId: z.string().uuid().nullable().optional(), items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1) });
const statusSchema = z.object({ status: z.nativeEnum(OrderStatus) });

type OrderWithRelations = Prisma.OrderGetPayload<{ include: { customer: true; table: true; items: { include: { product: true } } } }>;

function serializeOrder(order: OrderWithRelations) {
  return { ...order, totalPrice: Number(order.totalPrice), items: order.items.map((item) => ({ ...item, price: Number(item.price), product: { ...item.product, price: Number(item.product.price) } })) };
}

export async function getOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({ include: { customer: true, table: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" } });
  return res.json(orders.map(serializeOrder));
}

export async function getOrder(req: Request, res: Response) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { customer: true, table: true, items: { include: { product: true } } } });
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json(serializeOrder(order));
}

export async function createOrder(req: Request, res: Response) {
  const data = orderSchema.parse(req.body);
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, available: true } });
  const productMap = new Map(products.map((product) => [product.id, product]));
  const items = data.items.map((item) => { const product = productMap.get(item.productId); if (!product) throw new Error(`Product ${item.productId} is not available`); return { productId: item.productId, quantity: item.quantity, price: product.price }; });
  const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const order = await prisma.order.create({ data: { customerId: req.user?.customerId ?? data.customerId, tableId: data.tableId ?? undefined, totalPrice, items: { create: items } }, include: { customer: true, table: true, items: { include: { product: true } } } });
  return res.status(201).json(serializeOrder(order));
}

export async function updateOrderStatus(req: Request, res: Response) {
  const data = statusSchema.parse(req.body);
  const order = await prisma.order.update({ where: { id: req.params.id }, data, include: { customer: true, table: true, items: { include: { product: true } } } });
  return res.json(serializeOrder(order));
}
