import { run } from "./server.js";

run().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`shippo connector failed: ${message}\n`);
  process.exitCode = 1;
});
