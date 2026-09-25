import { generateReactHelpers } from "@uploadthing/react";

import type { AppFileRouter } from "@/app/api/uploadthing/core";

/** Typed client helpers bound to the app's UploadThing file router. */
export const { useUploadThing } = generateReactHelpers<AppFileRouter>();
