'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Image,
  Clock,
  FileText,
  CheckCircle2,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sellerLeadSchema = z.object({
  ownerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  propertyAddress: z.string().min(10, 'Please enter the complete property address'),
  propertyType: z.enum(['apartment', 'house', 'villa', 'plot', 'commercial', 'farmhouse'], {
    required_error: 'Please select a property type',
  }),
  priceExpectation: z.string().min(1, 'Please enter your expected price'),
  preferredContactTime: z.enum(['morning', 'afternoon', 'evening', 'anytime'], {
    required_error: 'Please select a preferred contact time',
  }),
  notes: z.string().optional(),
});

type SellerLeadFormData = z.infer<typeof sellerLeadSchema>;

interface SellerLeadFormProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  preview: string;
}

export function SellerLeadForm({ className, onSuccess, onError }: SellerLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellerLeadFormData>({
    resolver: zodResolver(sellerLeadSchema),
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onSubmit = async (data: SellerLeadFormData) => {
    setIsSubmitting(true);

    try {
      // In production, this would submit to Payload CMS
      console.log('[SellerLeadForm] Submitting seller lead:', {
        ...data,
        photosCount: uploadedFiles.length,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      reset();
      setUploadedFiles([]);
      onSuccess?.();
    } catch (error) {
      console.error('[SellerLeadForm] Error:', error);
      onError?.('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn('rounded-2xl bg-green-50 p-8 text-center', className)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-green-900">
          Thank you for your interest!
        </h3>
        <p className="mt-2 text-sm text-green-700">
          We&apos;ve received your property details. Our team will contact you within 24 hours
          to discuss your property and provide a free valuation.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Submit Another Property
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">List Your Property</h2>
            <p className="text-sm text-gray-500">Get a free valuation from our experts</p>
          </div>
        </div>
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Owner Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('ownerName')}
          placeholder="Enter your full name"
          className={cn(
            'mt-1 block w-full rounded-lg border px-4 py-3 text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            errors.ownerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
          )}
        />
        {errors.ownerName && (
          <p className="mt-1 text-xs text-red-600">{errors.ownerName.message}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              {...register('phone')}
              placeholder="+91 98765 43210"
              className={cn(
                'block w-full rounded-lg border py-3 pl-10 pr-4 text-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={cn(
                'block w-full rounded-lg border py-3 pl-10 pr-4 text-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Property Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Property Address <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            {...register('propertyAddress')}
            placeholder="Enter complete property address including locality, city, and PIN code"
            rows={2}
            className={cn(
              'block w-full rounded-lg border py-3 pl-10 pr-4 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              errors.propertyAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
          />
        </div>
        {errors.propertyAddress && (
          <p className="mt-1 text-xs text-red-600">{errors.propertyAddress.message}</p>
        )}
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Property Type <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {[
            { value: 'apartment', label: 'Apartment' },
            { value: 'house', label: 'House' },
            { value: 'villa', label: 'Villa' },
            { value: 'plot', label: 'Plot' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'farmhouse', label: 'Farmhouse' },
          ].map((type) => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
            >
              <input
                type="radio"
                value={type.value}
                {...register('propertyType')}
                className="sr-only"
              />
              <span className={cn(
                'has-[:checked]:text-blue-700',
                errors.propertyType ? 'text-red-600' : 'text-gray-700'
              )}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
        {errors.propertyType && (
          <p className="mt-1 text-xs text-red-600">{errors.propertyType.message}</p>
        )}
      </div>

      {/* Price Expectation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expected Price <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="text"
            {...register('priceExpectation')}
            placeholder="e.g., 85 Lakhs or 1.2 Crore"
            className={cn(
              'block w-full rounded-lg border py-3 pl-8 pr-4 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              errors.priceExpectation ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
          />
        </div>
        {errors.priceExpectation && (
          <p className="mt-1 text-xs text-red-600">{errors.priceExpectation.message}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Property Photos (Optional)
        </label>
        <div className="mt-1">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-blue-400 hover:bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">
              Click to upload photos
            </span>
            <span className="mt-1 text-xs text-gray-400">
              JPG, PNG up to 5MB each (max 10 photos)
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferred Contact Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Contact Time <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            {...register('preferredContactTime')}
            className={cn(
              'block w-full rounded-lg border py-3 pl-10 pr-4 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              errors.preferredContactTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
            )}
          >
            <option value="">Select preferred time</option>
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 8 PM)</option>
            <option value="anytime">Anytime</option>
          </select>
        </div>
        {errors.preferredContactTime && (
          <p className="mt-1 text-xs text-red-600">{errors.preferredContactTime.message}</p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Notes (Optional)
        </label>
        <div className="relative mt-1">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            {...register('notes')}
            placeholder="Any additional information about your property..."
            rows={3}
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors',
          'bg-blue-600 text-white hover:bg-blue-700',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Home className="h-4 w-4" />
            Get Free Valuation
          </>
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-center text-xs text-gray-500">
        Your information is secure and will only be used to contact you about your property.
        We do not share your details with third parties.
      </p>
    </form>
  );
}
