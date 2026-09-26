import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";
import type { UploadedFileData } from "uploadthing/types";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

const utapi = new UTApi();

const WEBP_QUALITY = 70;

/**
 * Re-encode an uploaded image as quality-70 WebP on the server: download the
 * just-uploaded original from the CDN, convert, upload the .webp next to it
 * and delete the original so only the optimized file remains.
 * Throws when conversion fails — callers fall back to the original file.
 */
async function toOptimizedWebp(file: UploadedFileData): Promise<string> {
  const response = await fetch(file.ufsUrl);
  const original = Buffer.from(await response.arrayBuffer());
  const webp = await sharp(original).rotate().webp({ quality: WEBP_QUALITY }).toBuffer();

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const uploaded = await utapi.uploadFiles(
    new File([webp], `${baseName}.webp`, { type: "image/webp" }),
  );
  if (!uploaded.data) {
    throw new Error(uploaded.error?.message ?? "WebP re-upload failed");
  }

  await utapi.deleteFiles(file.key);
  return uploaded.data.ufsUrl;
}

/**
 * File uploads for editable site content. Images land on UploadThing's CDN;
 * the editor stores the returned URL in the content JSON. Every image is
 * converted to WebP at 70% quality server-side, so the CMS only ever stores
 * optimized files.
 */
export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) {
        throw new UploadThingError("Unauthorized");
      }
      // view-only (demo) accounts are rejected at the API, not hidden in the UI
      if (session.user.role === "demo") {
        throw new UploadThingError(
          "You don't have permission to upload files. Ask an admin for access."
        );
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      let url = file.ufsUrl;
      try {
        url = await toOptimizedWebp(file);
      } catch (error) {
        // never fail the upload over optimization — keep the original instead
        console.error("[uploadthing] WebP conversion failed, keeping original:", error);
      }
      try {
        await prisma.mediaAsset.create({
          data: {
            url,
            filename: file.name,
            size: file.size,
            createdBy: metadata.userId,
          },
        });
      } catch (error) {
        // library registration is best-effort; the upload itself is already done
        console.error("[uploadthing] media library registration failed:", error);
      }
      return { uploadedBy: metadata.userId, url };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
