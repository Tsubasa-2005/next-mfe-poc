import { getMigrations } from "better-auth/db/migration";
import { auth } from "./auth.ts";

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);

if (toBeCreated.length === 0 && toBeAdded.length === 0) {
  console.log("No migrations needed.");
  process.exit(0);
}

if (toBeCreated.length > 0) {
  console.log("Tables to create:", toBeCreated.map((t) => t.table).join(", "));
}
if (toBeAdded.length > 0) {
  console.log(
    "Columns to add:",
    toBeAdded.flatMap((c) => Object.keys(c.fields).map((f) => `${c.table}.${f}`)).join(", ")
  );
}

await runMigrations();
console.log("Migration completed.");
