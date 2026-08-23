# Pre-task Hook

**Trigger:** before investigation or editing.

**Preconditions:** repository root available.

**Action:** confirm a clean/understood baseline, locate breaker configuration and tests, confirm no secrets are being copied into evidence, and record the current revision.

**Command:** use the repository's read-only status/revision commands; no mutation is required.

**Expected result:** baseline revision and pre-existing changes are known before agent edits.

**Failure behavior:** unknown pre-existing changes or inaccessible configuration blocks editing; investigation may continue read-only.

**Blocking:** yes for edits, no for read-only investigation.
