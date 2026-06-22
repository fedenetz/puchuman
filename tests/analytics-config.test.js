import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("production analytics configuration remains environment-driven", async () => {
  await assert.rejects(access(".env.production"));
  const exampleEnv = await readFile(".env.example", "utf8");
  assert.match(exampleEnv, /^VITE_ANALYTICS_ENABLED=false$/m);
  assert.match(exampleEnv, /^VITE_GA_MEASUREMENT_ID=$/m);
  assert.doesNotMatch(exampleEnv, /^VITE_GA_MEASUREMENT_ID=G-/m);
});
