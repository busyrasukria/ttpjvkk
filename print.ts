/**
 * Thermal printing utility
 * Opens a lightweight print window with thermal-friendly CSS and auto prints tickets.
 */

import type { Ticket } from "../types";

/**
 * Builds thermal-print HTML for a set of tickets.
 * - Uses mm units and @page size to target common 58mm rolls (adjust as needed)
 */
function buildPrintHtml(tickets: Ticket[]): string {
  const itemHtml = tickets
    .map(
      (t) => `
    <section class="ticket">
      <div class="qr-and-info">
        <img class="qr" src="${t.qrUrl}" alt="QR" />
        <div class="info">
          <div class="line strong">${escapeHtml(t.payload.partName)}</div>
          <div class="line">Part No: <span class="mono">${escapeHtml(t.payload.partNo)}</span></div>
          <div class="line">Model: <span class="mono">${escapeHtml(t.payload.model)}</span></div>
          <div class="line">Runner: ${escapeHtml(t.payload.runner)}</div>
          <div class="line strong">SN: <span class="mono">${escapeHtml(t.payload.uniqueNo)}</span></div>
        </div>
      </div>
      <div class="footer">
        <span>${new Date(t.payload.ts).toLocaleString()}</span>
      </div>
    </section>
  `
    )
    .join("");

  // Inline CSS: sized for 58mm width, ~40mm height labels, no margins.
  const styles = `
    <style>
      @page {
        size: 58mm 40mm;
        margin: 0;
      }
      html, body {
        padding: 0;
        margin: 0;
        width: 58mm;
      }
      body {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: #000;
      }
      .ticket {
        width: 58mm;
        height: 40mm;
        box-sizing: border-box;
        padding: 2mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        page-break-after: always;
      }
      .qr-and-info {
        display: grid;
        grid-template-columns: 20mm 1fr;
        column-gap: 2mm;
        align-items: start;
      }
      .qr {
        width: 20mm;
        height: 20mm;
        object-fit: cover;
      }
      .info {
        font-size: 10pt;
        line-height: 1.15;
      }
      .line {
        margin-bottom: 1mm;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .strong {
        font-weight: 700;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      .footer {
        font-size: 8pt;
        display: flex;
        justify-content: space-between;
        border-top: 1px dashed #000;
        padding-top: 1mm;
      }
      @media print {
        .ticket {
          break-after: page;
        }
      }
    </style>
  `;

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>FG Tickets</title>
        ${styles}
      </head>
      <body>
        ${itemHtml}
        <script>
          // Auto-print with a small delay; close the window after
          window.addEventListener('load', () => {
            setTimeout(() => {
              try { window.print(); } catch(e) {}
              setTimeout(() => { window.close(); }, 300);
            }, 250);
          });
        </script>
      </body>
    </html>
  `;
  return html;
}

/**
 * Opens a dedicated print window and injects label HTML.
 * For silent printing, integrate QZ Tray; this triggers normal browser print.
 */
export function printTickets(tickets: Ticket[]): void {
  const w = window.open("", "_blank", "popup,width=600,height=800");
  if (!w) {
    alert("Popup blocked. Please allow popups for printing.");
    return;
  }
  w.document.open();
  w.document.write(buildPrintHtml(tickets));
  w.document.close();
}

/** Basic HTML escaping to keep print content safe */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}