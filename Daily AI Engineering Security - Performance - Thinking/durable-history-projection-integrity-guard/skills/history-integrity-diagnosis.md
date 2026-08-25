# Skill: History Integrity Diagnosis

## Purpose
Diagnose whether resumed/rendered agent history is a trustworthy projection of durable session events.

## Trigger
Unexpectedly short history, missing tool/final messages, resume showing interrupted/in-progress despite completion, migration/update, or pagination/projection error.

## Inputs
Authoritative durable JSONL, projected JSONL, and optional runtime state (`idle`, `running`, `complete`, `interrupted`).

## Preconditions
Preserve the durable source read-only. Do not rewrite history before baseline evidence is captured.

## Required context
Session/thread identity, projection version/mode if known, event ordinal semantics, and which event types are considered critical by the host.

## Allowed tools
Read-only file access, `scripts/history_projection_audit.py`, hashes, database/export reads, and application logs. Repair writes require separate workflow authorization.

## Constraints
Do not infer lost history solely from UI appearance. Do not request hidden chain-of-thought. Use observable events, ordinals, states, hashes, and projection outputs.

## Procedure
1. Capture source/projection hashes, record counts, min/max ordinals, and current runtime state.
2. Run `python scripts/history_projection_audit.py --durable <durable.jsonl> --projected <projected.jsonl> --runtime-state <state>`.
3. Record Facts, Evidence, Assumptions, and finding codes separately.
4. Classify: `healthy`, `degraded`, or `invalid`.
5. If degraded/invalid, locate the first missing/mismatched ordinal and its event type.
6. Determine whether the failure is parser/schema, cursor continuity, terminal reconciliation, or renderer visibility.
7. Form one repair hypothesis at a time and test on a copy/derived projection.
8. Rerun the audit after each repair attempt. Maximum two repair attempts.
9. Require independent verification before resuming consequential work.

## Decision points
- Full coverage and terminal agreement: healthy.
- Missing only explicitly non-critical events without terminal contradiction: degraded; normal continuation depends on host policy.
- Missing critical events, ordinal inversion/duplication, or terminal contradiction: invalid; block normal continuation.

## Expected output
Structured report with status, coverage ratio, missing ordinals, duplicate/out-of-order evidence, terminal evidence/status, findings, and recommended recovery class.

## Metrics
Coverage ratio, missing critical event count, terminal mismatch count, rebuild attempts, repeated-work incidents, diagnosis latency.

## Verification
Regression tests must prove healthy source/projection acceptance and detection of truncation, gaps, duplicate ordinals, and terminal mismatch.

## Failure handling
Audit input/schema failure blocks trust in the projection. One evidence refresh is allowed; two repair attempts maximum; then escalate with the durable source untouched.

## Stop conditions
Stop when independent verification returns healthy, when a human explicitly accepts degraded read-only recovery, or after the second unsuccessful repair attempt.
