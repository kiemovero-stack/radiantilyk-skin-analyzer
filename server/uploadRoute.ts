/**
 * Dedicated Express route for multipart image uploads.
 * 
 * This bypasses tRPC entirely to avoid body size limits on the production gateway.
 * Images are sent as multipart/form-data (much more efficient than base64 JSON),
 * uploaded to S3, and the S3 URLs are returned to the client.
 * 
 * Authentication is handled by reading the session cookie directly.
 */
import type { Express, Request, Response } from "express";
import multer from "multer";
import { sdk } from "./_core/sdk";
import { storagePut } from "./storage";

// Configure multer to store files in memory (we'll upload to S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file (after client-side compression, should be ~200-500KB)
    files: 3, // Max 3 files (front, left, right)
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * Register the /api/upload-images route on the Express app.
 */
export function registerUploadRoute(app: Express) {
  app.post(
    "/api/upload-images",
    upload.array("photos", 3),
    async (req: Request, res: Response) => {
      try {
        // Authenticate the request using the session cookie
        let user;
        try {
          user = await sdk.authenticateRequest(req);
        } catch {
          res.status(401).json({ error: "Unauthorized" });
          return;
        }

        if (!user) {
          res.status(401).json({ error: "Unauthorized" });
          return;
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }

        // Get the angles from the form body (sent as comma-separated or individual fields)
        const anglesRaw = req.body.angles;
        let angles: string[];
        if (typeof anglesRaw === "string") {
          angles = anglesRaw.split(",").map((a: string) => a.trim());
        } else if (Array.isArray(anglesRaw)) {
          angles = anglesRaw;
        } else {
          // Default: assign angles based on file count
          angles = files.map((_, i) => ["front", "left", "right"][i] || "front");
        }

        console.log(`[Upload] Received ${files.length} file(s) from user ${user.id}, sizes: ${files.map(f => `${(f.size / 1024).toFixed(0)}KB`).join(", ")}`);

        // Upload each file to S3
        const uploadedImages: { url: string; angle: string }[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const angle = angles[i] || "front";
          const ext = file.mimetype.includes("png") ? "png" : "jpg";
          const key = `skin-photos/${Date.now()}-${angle}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

          const { url } = await storagePut(key, file.buffer, file.mimetype);
          uploadedImages.push({ url, angle });
          console.log(`[Upload] Uploaded ${angle} view to S3: ${(file.size / 1024).toFixed(0)}KB`);
        }

        res.json({ uploadedImages });
      } catch (error: any) {
        console.error("[Upload] Error:", error?.message || error);
        res.status(500).json({ error: error?.message || "Upload failed" });
      }
    }
  );
}
