# Skill: Revalidate Stale Evidence

## Purpose
Refresh only the evidence that became stale, preserve prior evidence for auditability, and prevent unrelated context reloads.

## When to use
Use when the freshness evaluator reports `refresh-required`, `blocked`, or an invalidation event occurred after a tool result was observed.

## Inputs
- Existing freshness record.
- Current workflow state.
- Invalidation event log.
- Current source metadata.
- Downstream decisions that depend on the result.

## Preconditions
- Original evidence is preserved.
- The workflow has not already performed the configured maximum refresh attempts.

## Allowed tools
The same least-privilege read tool used for the original observation, or a safer equivalent.

## Constraints
- Never mutate the source merely to make validation pass.
- Never overwrite the original observation; write a new record linked by `supersedes_result_id`.
- Do not refresh unrelated sources.
- A changed result invalidates dependent conclusions until they are reconsidered.

## Procedure
1. Read the evaluator reasons and identify exactly which freshness condition failed.
2. Determine whether the failure is time-based, revision-based, event-based, query-input drift, source identity drift or missing evidence.
3. Re-run the original read with equivalent canonical query inputs unless the task itself changed.
4. Capture a new freshness record using `capture-tool-result-freshness.md`.
5. Link it to the old record using `supersedes_result_id`.
6. Compare result fingerprints.
7. If unchanged, mark dependent facts as refreshed; do not claim the result is identical beyond the recorded fingerprint scope.
8. If changed, enumerate dependent decisions and return them to planning/review before execution continues.
9. Run `scripts/evaluate-freshness.py` again against the new record and current state.
10. Stop after one transient retry by default; non-transient stale results are not retried repeatedly.

## Expected output
- New freshness record.
- Refresh report with `unchanged` or `changed`.
- List of invalidated downstream decisions when changed.

## Verification
The new record must pass schema validation and the evaluator must return `fresh` before it can be reused.

## Failure handling
- Transient read failure: retry once while preserving the first error.
- Permission failure: stop; do not widen permissions.
- Source unavailable: block dependent actions and report missing evidence.
- Repeated source change: stop and escalate rather than loop.

## Stop conditions
Stop when freshness is proven, the source remains unavailable, a changed result invalidates the active plan, or retry budget is exhausted.