/**
 * RunnerSelect component
 * A styled select element for choosing the current production runner (manpower).
 */

import React from "react";
import type { Runner } from "../types";

/** Props for RunnerSelect */
interface RunnerSelectProps {
  /** Runner options */
  runners: Runner[];
  /** Selected runner id */
  value?: string;
  /** Change handler returns selected id */
  onChange?: (id: string) => void;
}

/**
 * RunnerSelect
 * Dropdown to choose the runner/manpower for the job.
 */
export default function RunnerSelect({ runners, value, onChange }: RunnerSelectProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">Runner (manpower)</label>
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Select runner</option>
        {runners.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
