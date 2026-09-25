import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

/**
 * File uploads for editable site content. Images land on UploadThing's CDN;
 * the editor stores the returned URL in the content JSON.
 */
export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
