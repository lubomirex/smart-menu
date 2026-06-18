import QRCode from "qrcode";
import { env } from "../utils/env.js";

export function tableMenuUrl(tableId: string) { return `${env.PUBLIC_APP_URL}/menu?tableId=${tableId}`; }
export async function generateTableQrCode(tableId: string) { return QRCode.toDataURL(tableMenuUrl(tableId), { margin: 2, width: 320 }); }
