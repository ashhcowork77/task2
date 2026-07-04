'use client';

import { useCallback, useRef } from 'react';
import { Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import QRCode from 'qrcode';

interface PropertyQRCodeProps {
  propertyId: string;
  propertyTitle?: string;
  size?: number;
  showDownload?: boolean;
  className?: string;
}

function propertyUrl(propertyId: string, baseUrl?: string): string {
  if (baseUrl) return `${baseUrl}/properties/${propertyId}`;
  if (typeof window !== 'undefined') return `${window.location.origin}/properties/${propertyId}`;
  return `/properties/${propertyId}`;
}

/**
 * Property QR Code Component
 * Shows a scannable QR code linking to the property page.
 * Supports PNG download for print ads.
 */
export default function PropertyQRCode({
  propertyId,
  propertyTitle,
  size = 160,
  showDownload = true,
  className,
}: PropertyQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = propertyUrl(propertyId);

  const handleDownload = useCallback(async () => {
    const filename = propertyTitle
      ? `${propertyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`
      : `property_${propertyId}_qr.png`;

    try {
      await QRCode.toCanvas(canvasRef.current!, url, {
        width: size * 2,
        margin: 2,
        color: {
          dark: '#141414',
          light: '#ffffff',
        },
      });

      const canvas = canvasRef.current!;
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate QR code image:', err);
    }
  }, [url, propertyTitle, propertyId, size]);

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className ?? ''}`}>
      {/* QR Code SVG */}
      <div className="rounded-lg border border-black/10 bg-white p-3">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          fgColor="#141414"
          bgColor="#ffffff"
        />
      </div>

      {/* Hidden canvas for PNG generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Download button */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-medium text-[#6f6f6f] transition-colors hover:text-[#141414]"
          title="Download QR code for print"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </button>
      )}
    </div>
  );
}

/**
 * Compact QR code badge for use on property cards or in grids.
 * Small size, always shows download on hover.
 */
export function PropertyQRBadge({
  propertyId,
  propertyTitle,
  size = 80,
}: {
  propertyId: string;
  propertyTitle?: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = propertyUrl(propertyId);

  const handleDownload = useCallback(async () => {
    const filename = propertyTitle
      ? `${propertyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`
      : `property_${propertyId}_qr.png`;

    try {
      await QRCode.toCanvas(canvasRef.current!, url, {
        width: size * 3,
        margin: 2,
        color: { dark: '#141414', light: '#ffffff' },
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvasRef.current!.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate QR code image:', err);
    }
  }, [url, propertyTitle, propertyId, size]);

  return (
    <div className="group relative">
      <div className="rounded border border-black/10 bg-white p-2">
        <QRCodeSVG value={url} size={size} level="M" fgColor="#141414" bgColor="#ffffff" />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleDownload}
        className="absolute inset-0 flex items-center justify-center rounded bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
        title="Download QR code"
      >
        <QrCode className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
