# Skill — Verify Context Compaction Integrity

## Purpose
Verify that a compacted context preserves required task state before it replaces the source context.

## Trigger
Run for every automatic or manual compaction and whenever a persisted compacted context is loaded.

## Inputs
- `session_id`
- ordered source messages with stable IDs and roles
- snapshot close watermark
- active goal and completion state
- critical facts/constraints/approvals ledger
- candidate compacted summary envelope
- policy thresholds

## Preconditions
The source snapshot MUST be immutable for the duration of validation. Messages arriving after the watermark MUST be queued for the post-compaction tail rather than silently included or discarded.

## Required context
Only the source range being compacted, recent tail messages, critical ledger, and candidate summary are required. Do not load unrelated sessions.

## Allowed tools
Read-only session storage, deterministic JSON/text validators, token counter, and test runner. A summarizer may be called only when validation requests a bounded retry.

## Constraints
- MUST NOT mutate source history during verification.
- MUST NOT accept a summary with unknown source message IDs.
- MUST NOT infer that omitted critical constraints are harmless.
- MUST NOT use hidden chain-of-thought as evidence.

## Procedure
1. Freeze the source range and record `session_id`, first/last message IDs, count, and watermark.
2. Build a critical-state ledger containing active goal, constraints, approvals, explicit user decisions, completed actions, failed actions that affect retries, and pending work.
3. Require the candidate envelope to declare source IDs, generated-at time, reference-only status, active goal, completed work, pending work, constraints, and preserved critical facts.
4. Validate provenance: every cited source ID exists in the frozen range and belongs to the same session.
5. Validate coverage: each critical ledger entry has an explicit preserved representation or an approved external-reference pointer.
6. Validate chronology: completed work MUST NOT move back to pending; rejected/failed actions MUST NOT become successful; later decisions override superseded ones only when the source evidence supports it.
7. Validate message-race boundary: every message committed before the watermark is either in the compacted source range or retained verbatim in the tail.
8. Validate language/identity invariants when configured.
9. Measure token reduction independently from fidelity.
10. Return `allow` only if all blocking invariants pass. Otherwise retry summarization at most twice with the failed invariant list. After two failures, reject compaction and keep source context or use safe non-semantic eviction.

## Decision points
- Unknown provenance ID -> reject.
- Missing critical fact/constraint -> retry, then reject after retry budget.
- Cross-session provenance -> reject immediately.
- Token target missed but fidelity passes -> allow if within hard context limit; optimization may run later.
- Fidelity passes but pending-message watermark mismatch -> reject.

## Expected output
A machine-readable report with decision, invariant results, token before/after counts, provenance mismatches, critical-state coverage, retry count, and fallback chosen.

## Metrics
Critical-fact recall, provenance validity rate, cross-session contamination count, pending-message loss count, task-status reversal count, token reduction ratio, validation latency.

## Verification
Replay a regression corpus containing contamination, fabricated-turn, stale-task, language-drift, dropped-message, and valid-compaction fixtures.

## Failure handling
Keep the original state authoritative. Never publish an invalid candidate. If source context approaches the model limit, evict only artifacts that can be deterministically reloaded by stable reference.

## Stop conditions
Stop when all blocking invariants pass, retry budget reaches 2, or the immutable source snapshot can no longer be guaranteed.
