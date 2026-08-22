# Checkpointed Job Execution

## Purpose
Run long or failure-prone background jobs in bounded chunks while preserving enough state to resume safely.

## When to use
Use for imports, exports, migrations without schema changes, batch API processing, data synchronization, AI enrichment, and other jobs where reprocessing everything after interruption is costly or unsafe.

## Inputs
- Stable job ID and job type.
- Input file or other material that can be fingerprinted.
- Checkpoint path.
- Deterministic cursor or continuation token.
- Evidence about whether each processed chunk has external side effects.

## Preconditions
- Processing can be divided into deterministic chunks.
- A cursor can identify the next safe unit of work.
- Side effects are idempotent, transactional, or explicitly approval-gated before replay.

## Allowed tools
Repository reads, local scripts, test/build tools, logs, read-only database/API access, and approved write tools required by the job.

## Constraints
- Never advance the checkpoint before the corresponding chunk is durably committed.
- Never resume if job identity or input fingerprint differs.
- Never treat a completed checkpoint as resumable.

## Procedure
1. Identify the job entry point, input source, chunk boundary, side effects, and current failure behavior.
2. Determine the cursor semantics: last committed item, next page token, offset, primary key, or timestamp boundary.
3. Initialize a checkpoint with `scripts/checkpoint_gate.py init`.
4. Before each resume, run `verify` against job identity and the current input.
5. Process one bounded chunk.
6. Commit application side effects first.
7. Atomically update cursor, processed count, and status.
8. On transient failure, preserve the last durable checkpoint and retry at most three times using configured backoff.
9. On non-transient failure, mark the checkpoint `failed`, store a concise error, and stop.
10. On successful exhaustion of input, mark the checkpoint `completed`.
11. Inspect logs and checkpoint contents before declaring completion.

## Expected output
A durable checkpoint, execution evidence, final status, processed count, and any unresolved replay risk.

## Verification
- Job identity and input fingerprint verify before resume.
- Cursor points only beyond committed work.
- Completed jobs reject further resume.
- Automated tests for checkpoint tooling pass.

## Failure handling
Transient tool/network failures: retry up to three times. Validation, permission, identity, fingerprint, or side-effect ambiguity: stop immediately and preserve evidence.

## Stop conditions
Stop on exhausted retries, changed input, mismatched job identity, ambiguous cursor semantics, or any replay that could duplicate irreversible side effects without approval.
