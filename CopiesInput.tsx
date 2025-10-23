/**
 * CopiesInput component
 * Simple numeric input for number of copies.
 */

import React from "react";

/** Props for CopiesInput */
interface CopiesInputProps {
  /** Current copies */
  value: number;
  /** Change handler */
  onChange?: (n: number) => void;
  /** Minimum value (default 1) */
  min?: number;
  /** Maximum value (optional) */
  max?: number;
}

/**
 * CopiesInput
 * Controlled number input with min/max clamping.
 */
export default function CopiesInput({ value, onChange, min = 1, max }: CopiesInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const n = Number(raw);
    const clamped = Number.isFinite(n) ? Math.max(min, Math.min(max ?? Infinity, n)) : min;
    onChange?.(clamped);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">Number of copies</label>
      <input
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : ""}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. 2"
      />
    </div>
  );
}
