/**
 * RunnerGallery component
 * Interactive, scrollable grid of runner (manpower) face cards for selection.
 */

import React from "react";
import type { Runner } from "../types";

/** Props for RunnerGallery */
interface RunnerGalleryProps {
  /** List of runners to show */
  runners: Runner[];
  /** Currently selected runner id */
  value?: string;
  /** Change handler: returns selected runner id */
  onChange?: (id: string) => void;
}

/**
 * RunnerGallery
 * Presents runners as avatar cards in a grid. Click a card to select.
 * Keyboard: Tab into cards; Enter/Space selects.
 */
export default function RunnerGallery({ runners, value, onChange }: RunnerGalleryProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">Runner (manpower)</label>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1"
        role="listbox"
        aria-label="Select runner"
      >
        {runners.map((r) => {
          const selected = r.id === value;
          return (
            <button
              key={r.id}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={r.name}
              onClick={() => onChange?.(r.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange?.(r.id);
                }
              }}
              className={[
                "group flex flex-col items-center rounded-lg border p-2 transition focus:outline-none focus:ring-2",
                selected
                  ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 focus:ring-blue-300",
              ].join(" ")}
            >
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={r.avatarUrl || "https://pub-cdn.sider.ai/u/U0Z6H6O5A87/web-coder/68f8e67b14c697e997a39c2b/resource/328a3c97-66cf-4e4f-8023-017a82c9eda2.jpg"}
                  alt={r.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className={[
                  "mt-2 text-xs text-center leading-tight",
                  selected ? "text-blue-800 font-semibold" : "text-gray-800",
                ].join(" ")}
                title={r.name}
              >
                {r.name}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">Tip: Click a face to select the current runner.</p>
    </div>
  );
}
