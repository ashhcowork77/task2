'use client';

import { useState } from 'react';
import { ArrowRightLeft, Calculator } from 'lucide-react';
import { AREA_UNITS, convertArea, formatConversion, type AreaUnit } from '@/lib/area-converter';

/**
 * Area Unit Converter Component
 * Converts between Indian land units: Sq Ft, Sq M, Guntha, Acre, Marla
 */
export default function AreaUnitConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<AreaUnit>('sqft');
  const [toUnit, setToUnit] = useState<AreaUnit>('guntha');

  const numValue = parseFloat(value);
  const result = convertArea(numValue, fromUnit, toUnit);
  const formattedResult = formatConversion(numValue, fromUnit, toUnit);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitKeys = Object.keys(AREA_UNITS) as AreaUnit[];

  return (
    <div className="bg-white p-6 shadow-[0_24px_80px_rgba(20,20,20,0.08)] ring-1 ring-black/5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2 border-b border-black/10 pb-4">
        <Calculator className="h-4 w-4 text-[#A1834C]" />
        <p className="text-[11px] font-semibold uppercase text-[#A1834C]">Utility</p>
      </div>
      <h3 className="text-xl font-medium tracking-tight text-[#141414]">Area Unit Converter</h3>
      <p className="mt-1 text-sm text-[#6f6f6f]">Convert between Indian land units</p>

      {/* Input */}
      <div className="mt-5 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter area value"
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          />
        </div>

        {/* From/To Units */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            >
              {unitKeys.map((unit) => (
                <option key={unit} value={unit}>
                  {AREA_UNITS[unit].label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapUnits}
            className="mt-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#6f6f6f] transition-colors hover:border-[#141414] hover:text-[#141414]"
            title="Swap units"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as AreaUnit)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            >
              {unitKeys.map((unit) => (
                <option key={unit} value={unit}>
                  {AREA_UNITS[unit].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result */}
      {value && !isNaN(numValue) && (
        <div className="mt-5 rounded-lg bg-[#F8F8F8] p-4 text-center">
          <p className="text-sm text-[#6f6f6f]">
            {numValue.toLocaleString('en-IN')} {AREA_UNITS[fromUnit].shortLabel} ={' '}
            <span className="font-semibold text-[#141414]">{formattedResult}</span>{' '}
            {AREA_UNITS[toUnit].shortLabel}
          </p>
        </div>
      )}

      {/* Conversion Table */}
      {value && !isNaN(numValue) && (
        <div className="mt-5 border-t border-black/10 pt-4">
          <p className="mb-3 text-xs font-medium uppercase text-[#6f6f6f]">
            All conversions for {numValue.toLocaleString('en-IN')} {AREA_UNITS[fromUnit].shortLabel}
          </p>
          <div className="space-y-2">
            {unitKeys
              .filter((u) => u !== fromUnit)
              .map((unit) => {
                const conv = formatConversion(numValue, fromUnit, unit);
                return (
                  <div
                    key={unit}
                    className="flex items-center justify-between rounded bg-[#F8F8F8] px-3 py-2 text-sm"
                  >
                    <span className="text-[#6f6f6f]">{AREA_UNITS[unit].label}</span>
                    <span className="font-medium text-[#141414]">
                      {conv} {AREA_UNITS[unit].shortLabel}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
