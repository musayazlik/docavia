import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `generate` (run on Vercel's postinstall) never opens a connection, so a
 * placeholder URL keeps CI builds alive when DATABASE_URL isn't set.
 * `migrate` commands run with a real DATABASE_URL from the environment.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://build:build@localhost:5432/build_placeholder",
  },
});
