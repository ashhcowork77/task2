'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';

interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  rate: number;
  tenureMonths: number;
  schedule: Array<{ month: number; principal: number; interest: number; balance: number }>;
}

function calculateEMI(principal: number, annualRate: number, tenureMonths: number): EMIResult {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  const schedule: EMIResult['schedule'] = [];
  let balance = principal;
  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({ month: m, principal: principalPaid, interest, balance });
  }

  return { emi, totalPayment, totalInterest, principal, rate: annualRate, tenureMonths, schedule };
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

/**
 * EMI / Mortgage Calculator Component
 * Computes monthly EMI, total interest, and amortization schedule.
 */
export default function EMIEstimator({
  initialPrice,
  className,
}: {
  initialPrice?: number;
  className?: string;
}) {
  const [price, setPrice] = useState(String(initialPrice ?? ''));
  const [downPaymentPct, setDownPaymentPct] = useState('20');
  const [rate, setRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo((): EMIResult | null => {
    const principal = parseFloat(price);
    if (isNaN(principal) || principal <= 0) return null;
    const dpPct = parseFloat(downPaymentPct) / 100;
    if (isNaN(dpPct) || dpPct < 0 || dpPct >= 1) return null;
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) return null;
    const years = parseInt(tenureYears, 10);
    if (isNaN(years) || years <= 0) return null;

    const loanAmount = principal * (1 - dpPct);
    return calculateEMI(loanAmount, r, years * 12);
  }, [price, downPaymentPct, rate, tenureYears]);

  const downPaymentAmt = result ? result.principal * (parseFloat(downPaymentPct) / (100 - parseFloat(downPaymentPct))) : 0;
  const loanAmount = result ? result.principal : 0;

  return (
    <div className={`bg-white p-6 shadow-[0_24px_80px_rgba(20,20,20,0.08)] ring-1 ring-black/5 ${className ?? ''}`}>
      {/* Header */}
      <div className="mb-5 border-b border-black/10 pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#A1834C]" />
          <p className="text-[11px] font-semibold uppercase text-[#A1834C]">Calculator</p>
        </div>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-[#141414]">EMI / Mortgage Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Property Price */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">
            Property Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 10000000"
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium uppercase text-[#6f6f6f]">
              Down Payment
            </label>
            <span className="text-sm font-medium text-[#141414]">
              {downPaymentPct}% — {result ? formatCurrency(downPaymentAmt) : '—'}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(e.target.value)}
            className="mt-2 w-full accent-[#A1834C]"
          />
          <div className="flex justify-between text-[10px] text-[#A5A5A5] mt-1">
            <span>5%</span><span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium uppercase text-[#6f6f6f]">Interest Rate (% p.a.)</label>
            <span className="text-sm font-medium text-[#141414]">{rate}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-2 w-full accent-[#A1834C]"
          />
          <div className="flex justify-between text-[10px] text-[#A5A5A5] mt-1">
            <span>5%</span><span>15%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">Loan Tenure (Years)</label>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 15, 20, 25].map((y) => (
              <button
                key={y}
                onClick={() => setTenureYears(String(y))}
                className={`flex-1 rounded border py-2 text-xs font-medium transition-colors ${
                  tenureYears === String(y)
                    ? 'border-[#A1834C] bg-[#A1834C] text-white'
                    : 'border-black/10 text-[#6f6f6f] hover:border-[#141414]'
                }`}
              >
                {y} yr
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="mt-5 rounded-lg bg-[#A1834C]/5 border border-[#A1834C]/20 p-4 text-center">
              <p className="text-xs font-medium uppercase text-[#A1834C]">Monthly EMI</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[#141414]">
                {formatCurrency(result.emi)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                <p className="text-xs text-[#6f6f6f]">Loan Amount</p>
                <p className="mt-1 text-sm font-semibold text-[#141414]">{formatCurrency(loanAmount)}</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                <p className="text-xs text-[#6f6f6f]">Down Payment</p>
                <p className="mt-1 text-sm font-semibold text-[#141414]">{formatCurrency(downPaymentAmt)}</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                <p className="text-xs text-[#6f6f6f]">Total Interest</p>
                <p className="mt-1 text-sm font-semibold text-[#141414]">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                <p className="text-xs text-[#6f6f6f]">Total Payment</p>
                <p className="mt-1 text-sm font-semibold text-[#141414]">{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>

            {/* Amortization Toggle */}
            <button
              onClick={() => setShowSchedule((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 text-xs text-[#A1834C] hover:underline"
            >
              <Info className="h-3 w-3" />
              {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
            </button>

            {showSchedule && (
              <div className="max-h-60 overflow-y-auto rounded-lg border border-black/10">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#F8F8F8]">
                    <tr>
                      <th className="px-3 py-2 text-left text-[#6f6f6f]">Month</th>
                      <th className="px-3 py-2 text-right text-[#6f6f6f]">Principal</th>
                      <th className="px-3 py-2 text-right text-[#6f6f6f]">Interest</th>
                      <th className="px-3 py-2 text-right text-[#6f6f6f]">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {result.schedule
                      .filter((_, i) => i % Math.max(1, Math.floor(result.tenureMonths / 24)) === 0 || i === result.tenureMonths - 1)
                      .map((row) => (
                        <tr key={row.month} className="hover:bg-[#F8F8F8]/50">
                          <td className="px-3 py-2 text-[#6f6f6f]">{row.month}</td>
                          <td className="px-3 py-2 text-right text-[#141414]">{formatCurrency(row.principal)}</td>
                          <td className="px-3 py-2 text-right text-[#A1834C]">{formatCurrency(row.interest)}</td>
                          <td className="px-3 py-2 text-right text-[#6f6f6f]">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
