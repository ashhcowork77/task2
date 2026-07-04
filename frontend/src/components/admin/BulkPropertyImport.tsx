'use client';

import { useCallback, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Upload, X } from 'lucide-react';

interface ValidationRow {
  rowNumber: number;
  status: 'valid' | 'warning' | 'error';
  data: Record<string, string>;
  errors: Array<{ field: string; message: string }>;
}

interface ImportResult {
  summary: { total: number; valid: number; warnings: number; errors: number };
  rows: ValidationRow[];
}

export default function BulkPropertyImport() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith('.csv') && f.type !== 'text/csv') {
      setError('Please upload a .csv file');
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleValidate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/properties/bulk-import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Validation failed');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    const res = await fetch('/api/properties/bulk-import');
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#141414]">Bulk Property Import</h2>
          <p className="mt-1 text-sm text-[#6f6f6f]">
            Upload a CSV file to import multiple property listings at once.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#141414] transition-colors hover:border-[#141414]"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          dragOver
            ? 'border-[#A1834C] bg-[#A1834C]/5'
            : 'border-black/10 hover:border-[#141414]'
        }`}
      >
        <Upload className={`mx-auto h-8 w-8 ${dragOver ? 'text-[#A1834C]' : 'text-[#A5A5A5]'}`} />
        <p className="mt-3 text-sm font-medium text-[#141414]">
          {file ? file.name : 'Drop your CSV file here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-[#A5A5A5]">.csv files only, max 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* File + Actions */}
      {file && (
        <div className="flex items-center justify-between rounded-lg border border-black/10 bg-[#F8F8F8] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#A1834C]/10">
              <span className="text-xs font-bold uppercase text-[#A1834C]">CSV</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#141414]">{file.name}</p>
              <p className="text-xs text-[#A5A5A5]">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={() => { setFile(null); setResult(null); setError(null); }}>
            <X className="h-4 w-4 text-[#A5A5A5] hover:text-[#141414]" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Validate Button */}
      {file && (
        <button
          onClick={handleValidate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-[#141414] px-5 py-3 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#A1834C] disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Validating...
            </>
          ) : (
            'Validate CSV'
          )}
        </button>
      )}

      {/* Results Summary */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Rows', value: result.summary.total, color: 'text-[#141414]' },
              { label: 'Valid', value: result.summary.valid, color: 'text-green-600' },
              { label: 'Warnings', value: result.summary.warnings, color: 'text-yellow-600' },
              { label: 'Errors', value: result.summary.errors, color: 'text-red-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-black/10 bg-white p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="mt-1 text-xs text-[#A5A5A5]">{label}</p>
              </div>
            ))}
          </div>

          {/* Row-level breakdown */}
          <div className="max-h-96 overflow-y-auto rounded-lg border border-black/10">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F8F8F8] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#6f6f6f]">Row</th>
                  <th className="px-4 py-3 font-medium text-[#6f6f6f]">Status</th>
                  <th className="px-4 py-3 font-medium text-[#6f6f6f]">Title</th>
                  <th className="px-4 py-3 font-medium text-[#6f6f6f]">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {result.rows.map((row) => (
                  <tr key={row.rowNumber} className="hover:bg-[#F8F8F8]/50">
                    <td className="px-4 py-3 text-[#A5A5A5]">{row.rowNumber}</td>
                    <td className="px-4 py-3">
                      {row.status === 'valid' && (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Valid
                        </span>
                      )}
                      {row.status === 'warning' && (
                        <span className="inline-flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="h-3.5 w-3.5" /> Warning
                        </span>
                      )}
                      {row.status === 'error' && (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <X className="h-3.5 w-3.5" /> Error
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#141414]">
                      {row.data.title ?? <span className="italic text-[#A5A5A5]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#6f6f6f]">
                      {row.errors.length > 0 ? (
                        <ul className="space-y-0.5">
                          {row.errors.slice(0, 2).map((e, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium">{e.field}:</span> {e.message}
                            </li>
                          ))}
                          {row.errors.length > 2 && (
                            <li className="text-xs italic text-[#A5A5A5]">
                              +{row.errors.length - 2} more
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-xs italic text-[#A5A5A5]">No issues</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
