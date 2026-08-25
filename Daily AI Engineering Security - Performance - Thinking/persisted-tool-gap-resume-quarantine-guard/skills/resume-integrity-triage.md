# Skill: Resume Integrity Triage

## Purpose
Determine whether a persisted agent thread is structurally safe to resume after crash, restart, or missing-tool-output failure.

## Trigger
Before resuming a thread after runtime/app-server restart, or whenever the host reports a missing tool output.

## Inputs
Persisted JSONL event history, checkpoint metadata, tool mutability classification, and durable external evidence when available.

## Preconditions
Use a read-only copy of persisted history. Preserve original timestamps and IDs.

## Required context
Thread identity, last verified checkpoint, intended user goal, outstanding side effects, and verification state.

## Allowed tools
Read-only transcript/event inspection, deterministic `scripts/tool_gap_guard.py`, and read-only queries to authoritative systems of record.

## Constraints
MUST NOT execute unresolved tools during diagnosis. MUST NOT synthesize missing outputs from model guesses. MUST NOT expose hidden chain-of-thought.

## Procedure
1. Scan history and enumerate calls/results by `tool_call_id`.
2. Separate unmatched calls, orphan results, and duplicate call IDs.
3. For each unmatched call, classify tool as read-only or state-changing.
4. Search authoritative durable evidence for the exact invocation outcome.
5. If exact result is recoverable, record provenance and independently verify it.
6. If not recoverable, select the last verified checkpoint before the gap and fork there.
7. Re-run the scan on the recovery history before model execution.

## Decision points
No anomalies: resume. Unmatched read-only call: quarantine until reconstructed or forked. Unmatched state-changing call: quarantine; require idempotency/outcome evidence or human approval. Duplicate IDs/orphan results: quarantine and investigate persistence/correlation.

## Expected output
Integrity status, anomaly list, last verified checkpoint, recovery recommendation, and evidence provenance.

## Metrics
Unmatched calls/run, time to recovery, retries avoided, duplicated side effects avoided, usage wasted on failed resumes, verification coverage.

## Verification
A second reviewer reproduces the anomaly set and confirms any reconstructed result against the authoritative source.

## Failure handling
Retry evidence collection at most twice. If outcome remains ambiguous, preserve state and fork from a verified checkpoint.

## Stop conditions
Stop after the history is structurally valid and independently verified, or when safe recovery is impossible without human action.
