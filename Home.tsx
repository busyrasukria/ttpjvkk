/**
 * Home page
 * UX flow to print Finished Good tickets:
 * 1) Select a part by clicking its picture.
 * 2) Select runner (manpower) via interactive face gallery.
 * 3) Select quantity: STD packing or custom QTY
 * 4) Click Print → generates QR-based labels and prints to thermal printer.
 *
 * Notes:
 * - Uses API endpoints (/api/*.php). If unreachable, falls back to mock data.
 * - For true silent printing, integrate QZ Tray on client machines.
 */

import React from "react";
import { fetchParts, fetchRunners, createTickets } from "../services/api";
import PartCard from "../components/PartCard";
import RunnerGallery from "../components/RunnerGallery";
import QuantitySelector from "../components/QuantitySelector";
import { printTickets } from "../lib/print";
import type { Part, Runner } from "../types";
import AddPartForm from "../components/AddPartForm"; // <-- TAMBAHAN BARU

/**
 * Simple status banner for user feedback
 */
function Status({
  kind,
  message,
}: {
  kind: "info" | "success" | "error";
  message: string;
}) {
  const colors =
    kind === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : kind === "error"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-blue-50 text-blue-800 border-blue-200";
  return <div className={`rounded-md border px-3 py-2 text-sm ${colors}`}>{message}</div>;
}

/**
 * HomePage
 * Displays parts grid, selection of runner and quantity, and triggers printing.
 */
export default function HomePage() {
  const [parts, setParts] = React.useState<Part[]>([]);
  const [runners, setRunners] = React.useState<Runner[]>([]);
  const [selectedPartId, setSelectedPartId] = React.useState<string | undefined>(undefined);
  const [selectedRunnerId, setSelectedRunnerId] = React.useState<string | undefined>(undefined);
  const [copies, setCopies] = React.useState(1);

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ kind: "info" | "success" | "error"; message: string } | null>(null);

  // Fungsi untuk muat semula (refresh) data parts
  const loadData = async () => {
    try {
      const [p, r] = await Promise.all([fetchParts(), fetchRunners()]);
      setParts(p);
      setRunners(r);
    } catch {
      // Biarkan data sedia ada jika gagal
      console.error("Gagal memuat semula data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true); // Tunjuk 'loading' bila 'refresh'
      try {
        const [p, r] = await Promise.all([fetchParts(), fetchRunners()]);
        if (!mounted) return;
        setParts(p);
        setRunners(r);
      } catch {
        // Ralat akan ditangkap oleh fallback dalam api.ts
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedPart = parts.find((p) => p.id === selectedPartId);
  const readyToPrint = !!selectedPartId && !!selectedRunnerId && copies >= 1;

  /**
   * Handle printing: request tickets from backend and send to print utility.
   */
  async function handlePrint() {
    if (!readyToPrint || !selectedPartId || !selectedRunnerId) return;
    setSubmitting(true);
    setStatus({ kind: "info", message: "Generating tickets..." });
    try {
      const res = await createTickets({ partId: selectedPartId, runnerId: selectedRunnerId, copies }, parts, runners);
      if (!res.tickets?.length) throw new Error("No tickets returned");
      printTickets(res.tickets);
      setStatus({ kind: "success", message: `Sent ${res.tickets.length} label(s) to print.` });
    } catch (e) {
      console.error(e);
      setStatus({
        kind: "error",
        message: "Failed to generate/print tickets. Please check connection or popup blockers.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Fungsi untuk 'refresh' senarai parts selepas berjaya tambah part baru
  const handlePartAdded = () => {
    setStatus({ kind: "success", message: "Part baru berjaya ditambah! Memuat semula senarai..." });
    setLoading(true); // Tunjuk loading
    loadData(); // Panggil data baru dari server
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a3b/resource/ff9a6596-ca73-4376-a131-71324bf3ff5f.jpg"
              className="h-10 w-10 rounded object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-900">FG Ticket Printer</h1>
          </div>
          <div className="text-sm text-gray-600 hidden sm:block">Touch Screen Ready • Thermal Print</div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Finished Good Parts</h2>
              <p className="text-base text-gray-600">Tap a part to proceed</p>
            </div>
            {status ? <Status kind={status.kind} message={status.message} /> : null}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600 text-lg">Loading parts...</div>
          ) : parts.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {parts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  selected={part.id === selectedPartId}
                  onClick={() => setSelectedPartId(part.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 text-lg">No parts available</div>
          )}

          {/* --- BORANG BARU DITAMBAH DI SINI --- */}
          {/* Kita hantar 'onPartAdded' supaya borang boleh panggil 'loadData' */}
          <AddPartForm onPartAdded={handlePartAdded} />
          
        </section>

        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sticky top-20">
            <div className="space-y-6">
              {/* Selected Part */}
              <div className="space-y-3">
                <label className="text-lg font-medium text-gray-800">Selected Part</label>
                <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 p-4 bg-gray-50">
                  {selectedPart ? (
                    <>
                      <img
                        src={selectedPart.imageUrl}
                        alt={selectedPart.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold text-gray-900 truncate">{selectedPart.name}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {selectedPart.partNo} • {selectedPart.model}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          STD: {selectedPart.stdPacking} pcs
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-base text-gray-500 py-2 text-center w-full">No part selected</div>
                  )}
                </div>
              </div>

              {/* Quantity Selection */}
              <QuantitySelector 
                selectedPart={selectedPart}
                value={copies}
                onChange={setCopies}
              />

              {/* Runner Selection */}
              <RunnerGallery runners={runners} value={selectedRunnerId} onChange={setSelectedRunnerId} />

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={!readyToPrint || submitting}
                className={`w-full h-14 rounded-xl text-lg font-semibold transition-all ${
                  readyToPrint && !submitting 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? "Printing..." : `Print ${copies} Label${copies > 1 ? 's' : ''}`}
              </button>

              <div className="text-sm text-gray-500 text-center">
                For silent printing, install QZ Tray and configure default thermal printer
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
