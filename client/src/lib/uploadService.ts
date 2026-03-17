/**
 * Client-side upload service.
 * 
 * Sends compressed images via multipart/form-data to the dedicated
 * Express upload endpoint (/api/upload-images), bypassing tRPC
 * and its body size limitations.
 */

import { compressImage } from "./imageCompressor";

export interface UploadedImage {
  url: string;
  angle: string;
}

export interface UploadResult {
  uploadedImages: UploadedImage[];
}

export interface ImageToUpload {
  file: File;
  angle: "front" | "left" | "right";
}

/**
 * Compress and upload images via multipart/form-data.
 * Returns the S3 URLs for each uploaded image.
 */
export async function uploadImages(
  images: ImageToUpload[],
  onProgress?: (message: string) => void
): Promise<UploadResult> {
  onProgress?.("Compressing images...");

  // Compress all images in parallel
  const compressedFiles = await Promise.all(
    images.map(async (img) => {
      const compressed = await compressImage(img.file);
      return { file: compressed, angle: img.angle };
    })
  );

  onProgress?.("Uploading images...");

  // Build multipart form data
  const formData = new FormData();
  const angles: string[] = [];

  for (const { file, angle } of compressedFiles) {
    formData.append("photos", file);
    angles.push(angle);
  }
  formData.append("angles", angles.join(","));

  // Send via fetch to the dedicated upload endpoint
  const response = await fetch("/api/upload-images", {
    method: "POST",
    credentials: "include", // Include session cookie
    body: formData,
    // Note: Do NOT set Content-Type header — browser sets it with boundary
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(errorData.error || `Upload failed with status ${response.status}`);
  }

  return response.json();
}
