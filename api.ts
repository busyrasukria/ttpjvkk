/**
 * API service for PHP backend
 * Provides calls to parts, manpower, and ticket creation endpoints with graceful fallbacks.
 */

import type {
  CreateTicketsRequest,
  CreateTicketsResponse,
  Part,
  Runner,
  Ticket,
  TicketPayload,
} from "../types";
import { generateTicketSerial } from "../lib/ids";

const API_BASE = "/api";

/**
 * Fetch list of parts from PHP backend.
 * Falls back to mock data if server is unavailable.
 */
export async function fetchParts(): Promise<Part[]> {
  try {
    const res = await fetch(`${API_BASE}/parts.php`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as Part[];
    return data;
  } catch {
    // Mock data for development/preview
    return [
      {
        id: "p1",
        name: "Gear Assembly",
        partNo: "GA-1042",
        model: "M-AX",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/c8a86152-2656-4d2d-beaa-b8b7ce8d123f.jpg",
        stdPacking: 10,
      },
      {
        id: "p2",
        name: "Control Panel",
        partNo: "CP-221B",
        model: "M-BRX",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/4e0f2310-5562-46b7-aa57-fba2988783ba.jpg",
        stdPacking: 5,
      },
      {
        id: "p3",
        name: "Cooling Fan",
        partNo: "CF-7810",
        model: "M-ECO",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/63186bdf-a9cd-45a1-90b8-d4df0170a0e8.jpg",
        stdPacking: 20,
      },
      {
        id: "p4",
        name: "Sensor Module",
        partNo: "SM-500",
        model: "M-PRO",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/754dd4c0-07b2-4d7f-b458-b20cc6c0970c.jpg",
        stdPacking: 15,
      },
      {
        id: "p5",
        name: "Drive Belt",
        partNo: "DB-92",
        model: "M-AX",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/d2ff4f0d-1adf-420d-bc51-b35225b4af96.jpg",
        stdPacking: 25,
      },
      {
        id: "p6",
        name: "Valve Body",
        partNo: "VB-300",
        model: "M-HYD",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/c25fcf19-b178-4e6f-873c-dc0b28be2232.jpg",
        stdPacking: 8,
      },
    ];
  }
}

/**
 * Fetch list of runners/manpower from PHP backend.
 * Falls back to 24 mock faces if server is unavailable.
 */
export async function fetchRunners(): Promise<Runner[]> {
  try {
    const res = await fetch(`${API_BASE}/manpower.php`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as Runner[];
    return data;
  } catch {
    const face = (_i: number) => "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/bceeca13-8bbe-4ed6-8898-a533a7e9e46f.jpg";
    return [
      { id: "r1", name: "Aisyah", avatarUrl: face(1) },
      { id: "r2", name: "Daniel", avatarUrl: face(2) },
      { id: "r3", name: "Farid", avatarUrl: face(3) },
      { id: "r4", name: "Mei Lin", avatarUrl: face(4) },
      { id: "r5", name: "Prakash", avatarUrl: face(5) },
      { id: "r6", name: "Rina", avatarUrl: face(6) },
      { id: "r7", name: "Amir", avatarUrl: face(7) },
      { id: "r8", name: "Sofia", avatarUrl: face(8) },
      { id: "r9", name: "Kenji", avatarUrl: face(9) },
      { id: "r10", name: "Hana", avatarUrl: face(10) },
      { id: "r11", name: "Miguel", avatarUrl: face(11) },
      { id: "r12", name: "Priya", avatarUrl: face(12) },
      { id: "r13", name: "Omar", avatarUrl: face(13) },
      { id: "r14", name: "Nurul", avatarUrl: face(14) },
      { id: "r15", name: "Ivan", avatarUrl: face(15) },
      { id: "r16", name: "Sara", avatarUrl: face(16) },
      { id: "r17", name: "Jae", avatarUrl: face(17) },
      { id: "r18", name: "Lila", avatarUrl: face(18) },
      { id: "r19", name: "Yusuf", avatarUrl: face(19) },
      { id: "r20", name: "Elena", avatarUrl: face(20) },
      { id: "r21", name: "Chen", avatarUrl: face(21) },
      { id: "r22", name: "Maya", avatarUrl: face(22) },
      { id: "r23", name: "Arif", avatarUrl: face(23) },
      { id: "r24", name: "Grace", avatarUrl: face(24) },
    ];
  }
}

/**
 * Request the backend to create tickets and store them in MySQL.
 * If backend is unavailable, generates local (unsaved) tickets for printing demo.
 */
export async function createTickets(
  req: CreateTicketsRequest,
  parts?: Part[],
  runners?: Runner[]
): Promise<CreateTicketsResponse> {
  try {
    const res = await fetch(`${API_BASE}/tickets.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as CreateTicketsResponse;
    return data;
  } catch {
    // Fallback: synthesize tickets locally
    const part =
      (parts || []).find((p) => p.id === req.partId) || {
        id: req.partId,
        name: "Unknown Part",
        partNo: "N/A",
        model: "N/A",
        imageUrl: "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/2fe31d18-5fe6-4de3-8715-9f71799e6aea.jpg",
        stdPacking: 1,
      };
    const runner =
      (runners || []).find((r) => r.id === req.runnerId) || { id: req.runnerId, name: "Unknown" };

    const tickets: Ticket[] = Array.from({ length: Math.max(1, req.copies) }).map(() => {
      const serial = generateTicketSerial("FG");
      const payload: TicketPayload = {
        partName: part.name,
        partNo: part.partNo,
        model: part.model,
        runner: runner.name,
        uniqueNo: serial,
        picture: part.imageUrl,
        ts: Date.now(),
      };
      const data = encodeURIComponent(JSON.stringify(payload));
      // Use '&' in query string (not '&amp;') because this is a JS string, not HTML
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
      return { payload, qrUrl };
    });

    return { tickets };
  }
}
