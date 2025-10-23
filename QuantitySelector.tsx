/**
 * QuantitySelector component
 * Touch-friendly quantity selection with STD packing and custom options
 */

import React from "react";
import type { Part } from "../types";

/** Props for QuantitySelector */
interface QuantitySelectorProps {
  /** Selected part */
  selectedPart?: Part;
  /** Current quantity */
  value: number;
  /** Change handler */
  onChange?: (quantity: number) => void;
}

/**
 * QuantitySelector
 * Touch-friendly component for selecting STD packing or custom quantity
 */
export default function QuantitySelector({ selectedPart, value, onChange }: QuantitySelectorProps) {
  const [mode, setMode] = React.useState<"std" | "custom">("std");

  // When part changes, reset to STD packing
  React.useEffect(() => {
    if (selectedPart && mode === "std") {
      onChange?.(selectedPart.stdPacking);
    }
  }, [selectedPart, mode, onChange]);

  // Handle mode change
  const handleModeChange = (newMode: "std" | "custom") => {
    setMode(newMode);
    if (newMode === "std" && selectedPart) {
      onChange?.(selectedPart.stdPacking);
    }
  };

  // Handle custom quantity change
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 1;
    onChange?.(Math.max(1, newValue));
  };

  if (!selectedPart) {
    return (
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-800">Quantity</label>
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          Select a part first to choose quantity
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="text-lg font-medium text-gray-800">Quantity Selection</label>
      
      {/* Mode Selection - Large touch buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleModeChange("std")}
          className={`min-h-16 rounded-xl border-2 text-lg font-medium transition-colors ${
            mode === "std"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          <div>STD Packing</div>
          <div className="text-sm font-normal opacity-75">{selectedPart.stdPacking} pcs</div>
        </button>
        
        <button
          type="button"
          onClick={() => handleModeChange("custom")}
          className={`min-h-16 rounded-xl border-2 text-lg font-medium transition-colors ${
            mode === "custom"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          Custom QTY
        </button>
      </div>

      {/* Quantity Display/Input */}
      {mode === "std" ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{selectedPart.stdPacking}</div>
          <div className="text-sm text-blue-600 mt-1">Standard Packing Quantity</div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Enter Custom Quantity</label>
          <input
            type="number"
            min="1"
            value={value}
            onChange={handleCustomChange}
            className="w-full h-14 text-xl text-center rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Enter quantity..."
          />
        </div>
      )}
    </div>
  );
}
