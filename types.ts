/**
 * Types module
 * Defines shared TypeScript interfaces for Finished Good labels workflow.
 */

export interface Part {
  /** Unique ID for the part (from DB) */
  id: string;
  /** User-facing part name */
  name: string;
  /** Part number / code */
  partNo: string;
  /** Product model identifier */
  model: string;
  /** Image URL for display */
  imageUrl: string;
  /** Standard packing quantity */
  stdPacking: number;
}

export interface Runner {
  /** Unique ID for the runner/manpower (from DB) */
  id: string;
  /** Runner full name */
  name: string;
  /** Optional avatar/headshot URL for interactive gallery */
  avatarUrl?: string;
}

export interface TicketPayload {
  /** Part name */
  partName: string;
  /** Part number */
  partNo: string;
  /** Model */
  model: string;
  /** Runner name */
  runner: string;
  /** Unique serial number for the ticket */
  uniqueNo: string;
  /** Optional: production picture/part image */
  picture?: string;
  /** Unix timestamp (ms) */
  ts: number;
}

export interface Ticket {
  /** DB ID for ticket (if returned by backend) */
  id?: string;
  /** Data encoded in the QR code */
  payload: TicketPayload;
  /** Ready-to-use QR image URL */
  qrUrl: string;
}

/** Request payload sent to the backend to create tickets */
export interface CreateTicketsRequest {
  partId: string;
  runnerId: string;
  copies: number;
}

/** Response returned by backend after creating tickets */
export interface CreateTicketsResponse {
  tickets: Ticket[];
}
