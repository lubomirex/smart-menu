import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js";

const authSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function register(req: Request, res: Response) {
  const data = authSchema.parse(req.body);
  const customer = await prisma.customer.create({ data: { email: data.email.toLowerCase(), passwordHash: await hashPassword(data.password) } });
  const token = signToken({ customerId: customer.id, email: customer.email, role: customer.role });
  return res.status(201).json({ token, customer: { id: customer.id, email: customer.email, role: customer.role } });
}

export async function login(req: Request, res: Response) {
  const data = authSchema.parse(req.body);
  const customer = await prisma.customer.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!customer || !(await verifyPassword(data.password, customer.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
  const token = signToken({ customerId: customer.id, email: customer.email, role: customer.role });
  return res.json({ token, customer: { id: customer.id, email: customer.email, role: customer.role } });
}
