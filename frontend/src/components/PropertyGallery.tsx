'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  title: string;
}

/**
 * Property Gallery with Lightbox Carousel
 * Features:
 * - Main image display with aspect ratio
 * - Prev/Next navigation arrows
 * - Thumbnail strip with horizontal scroll
 * - Full-screen lightbox modal
 * - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 * - Wrap-around navigation
 */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Ensure images array is valid
  const validImages = images.length > 0 ? images : [{ url: '', alt: title }];
  const hasMultipleImages = validImages.length > 1;

  // Navigation with wrap-around
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentImage = validImages[currentIndex];

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-[16/9] cursor-pointer overflow-hidden bg-neutral-200"
        onClick={() => setIsOpen(true)}
      >
        {currentImage.url && (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        )}

        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 text-[#141414] opacity-0 shadow-lg backdrop-blur-md transition-opacity hover:bg-white group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 text-[#141414] opacity-0 shadow-lg backdrop-blur-md transition-opacity hover:bg-white group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 text-xs font-semibold uppercase text-white">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 text-xs font-semibold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100">
          <X className="h-4 w-4 rotate-45" />
          <span>Expand</span>
        </div>
      </div>

      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-[#141414] ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={image.alt || `${title} ${index + 1}`}
                  width={80}
                  height={60}
                  className="object-cover w-full h-full"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-3 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {hasMultipleImages && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 p-3 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          <div
            className="relative w-full max-w-6xl aspect-video mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage.url && (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {hasMultipleImages && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 p-3 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 text-sm text-white">
              {currentIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
