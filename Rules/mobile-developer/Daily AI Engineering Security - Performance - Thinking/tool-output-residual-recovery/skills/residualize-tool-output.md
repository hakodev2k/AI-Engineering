# Skill — Residualize Tool Output

## Purpose
Preserve exact tool evidence outside the model context while exposing a compact, verifiable recovery pointer.

## Trigger
Use when a tool result may exceed the inline context budget, contains exact evidence needed later, or will survive compaction/resume.

## Inputs
- tool name and invocation identifier;
- raw stdout/result bytes;
- process/tool completion status and exit code when available;
- artifact directory;
- inline preview budget.

## Preconditions
The tool wrapper can capture the complete result before model-facing truncation. The artifact directory must be writable and outside source-controlled product output unless explicitly desired.

## Allowed tools
Filesystem write/read, hashing, deterministic parsers, metadata logging.

## Constraints
Never label an interrupted/failed result as complete. Never put secrets into logs beyond what already exists in the protected artifact. Do not require an LLM to verify hashes.

## Procedure
1. Capture raw bytes and terminal completion metadata separately.
2. Compute SHA-256 of raw bytes.
3. Persist the raw output atomically using the content hash as identity.
4. Measure bytes and lines; record content type when known.
5. Create a bounded head/tail preview.
6. Emit a residual JSON record with artifact path, hash, sizes, preview, truncation flag, completion status, exit code, and timestamp.
7. Before a conclusion that depends on omitted content, retrieve the smallest useful range from the artifact.
8. Recompute the artifact hash before trusting recovered evidence.
9. Mark evidence `verified` only when completion status and required content have both been checked.

## Decision points
- If raw output fits the inline budget, retain inline output but still create a residual when exact evidence must survive compaction.
- If artifact persistence fails, do not discard the only complete output; stop before compaction or report evidence as unavailable.
- If hash verification fails, treat the artifact as corrupted and do not use it as evidence.

## Expected output
A small residual record plus a durable content-addressed artifact.

## Metrics
artifact coverage, recovery reads, avoided reruns, recovery latency, hash failures, completion-claim corrections.

## Verification
Run the package tests and a real large-output scenario. Confirm exact bytes can be recovered after the original inline preview is discarded.

## Failure handling
Retry atomic artifact persistence once for transient filesystem failure. On repeated failure, block compaction/continuation when exact output is required.

## Stop conditions
Stop when the artifact is durable, residual metadata validates, and all evidence needed for the current decision is either inline or recoverable.