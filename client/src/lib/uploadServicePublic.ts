/**
 * Public client-side upload service (no authentication required).
 * 
 * Sends compressed images via multipart/form-data to the public
 * Express upload endpoint (/api/client/upload-images).
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
 * Compress and upload images via public multipart/form-data endpoint.
 * Returns the S3 URLs for each uploaded image.
 */
export async function uploadImagesPublic(
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

  // Send via fetch to the PUBLIC upload endpoint (no auth cookie needed)
  const response = await fetch("/api/client/upload-images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(
      errorData.error || `Upload failed with status ${response.status}`
    );
  }

  return response.json();
}
