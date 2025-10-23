/**
 * PartCard component
 * Displays a finished good item with image and metadata, selectable as a step-1 input.
 */

import React from "react";
import type { Part } from "../types";

/** Props for PartCard */
interface PartCardProps {
  /** Part to display */
  part: Part;
  /** Whether this card is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: (part: Part) => void;
}

/**
 * PartCard
 * Renders a clickable card for a Finished Good part.
 */
export default function PartCard({ part, selected, onClick }: PartCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(part)}
      className={`group relative flex flex-col rounded-2xl border-2 transition-all shadow-sm overflow-hidden text-left min-h-40
        ${selected ? "border-blue-600 ring-4 ring-blue-200 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
      aria-pressed={selected}
    >
      <div className="h-32 w-full bg-gray-100">
        <img src={part.imageUrl} alt={part.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4 space-y-2 flex-1">
        <div className="font-semibold text-gray-900 leading-tight text-base">{part.name}</div>
        <div className="text-sm text-gray-600">
          Part No: <span className="font-mono">{part.partNo}</span>
        </div>
        <div className="text-sm text-gray-600">Model: {part.model}</div>
        <div className="text-sm font-medium text-blue-600">
          STD QTY: {part.stdPacking} pcs
        </div>
      </div>
      {selected ? (
        <div className="absolute top-3 right-3 text-sm bg-blue-600 text-white rounded-lg px-3 py-1 font-medium">
          Selected
        </div>
      ) : null}
    </button>
  );
}
