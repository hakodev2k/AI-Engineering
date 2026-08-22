# Skill: Compaction Feedback-Loop Diagnosis

## Purpose
Determine why context compaction repeats, fails, or consumes excessive tokens without sufficient reduction in the next model request.

## Trigger
Use when compaction fires repeatedly, follows `context_length_exceeded`, leaves context near the trigger threshold, or consumes significant tokens without a user-visible result.

## Inputs
- Session/request timeline with compaction events.
- Provider context limit and compaction threshold.
- Estimated and actual token usage when available.
- Context composition by bucket: system/tool schemas, conversation content, reasoning, tool-call envelopes, images/attachments, summaries, retry/error artifacts.
- Protected-tail and compression policy.
- `config/policy.json`.

## Preconditions
Preserve source-state identity with a stable fingerprint. Redact secrets while keeping sizes, roles, event types, timestamps, and bucket counts.

## Required context
Compaction trigger logic, summary input construction, persistence model, retry behavior, and provider serialization semantics.

## Allowed tools
Trace/log analysis, deterministic token/accounting scripts, source inspection, provider usage telemetry, unit/integration tests, and public issue/docs research.

## Constraints
- MUST NOT solve a compaction loop by silently dropping correctness-critical recent context.
- MUST NOT retry the same source fingerprint indefinitely.
- MUST distinguish retry debris from user/task state.
- MUST compare the post-compaction request size, not merely the summary length.

## Procedure
1. Build a chronological ledger of normal model requests, compaction attempts, failures, retries, and next requests.
2. Compute a stable source fingerprint from content identifiers/hashes before each compaction.
3. Bucket the source context and identify the largest contributors.
4. Record estimated input tokens and provider-reported actual input tokens where available.
5. For each attempt compute progress ratio `(before_tokens - after_tokens) / before_tokens` using the next real request when possible.
6. Detect same-fingerprint retries, compactions inside the cooldown window, retry debris added to future source material, and protected-tail configurations leaving negligible compressible content.
7. Form one primary hypothesis and identify a measurable expected outcome.
8. Apply controller policy: max attempts, minimum progress, target utilization, debris exclusion, and circuit opening.
9. Re-run on the captured timeline and a synthetic failure fixture.
10. Have an independent verifier confirm that the guard prevents the loop without removing required active-task context.

## Decision points
- If the same fingerprint already reached max attempts, open the circuit.
- If progress is below `minimum_progress_ratio`, enter cooldown; do not immediately compact again.
- If compressible content is smaller than the required reduction, select manual/new-session recovery rather than repeated summarization.
- If actual usage differs materially from estimates, calibrate the estimator before changing thresholds.
- If a non-text bucket dominates, use provider-specific accounting or exclusion rules rather than text-only heuristics.

## Expected output
Diagnosis with timeline, bucket accounting, source fingerprints, before/after metrics, root cause, controller decision, residual risks, and verification status.

## Metrics
Compactions per 10 minutes, attempts per fingerprint, pre/post tokens, progress ratio, failed-compaction tokens, retry-debris size, protected/compressible ratio, context utilization after compaction, and user-visible recovery success.

## Verification
A replay must stop repeated insufficient-progress attempts within configured bounds and must retain explicit required context fixtures.

## Failure handling
Measurement retries are capped at 3. If provider usage is unavailable, mark measurements estimated and do not claim exact savings. If context cannot be compacted safely, open the circuit and require explicit recovery instead of weakening the policy.

## Stop conditions
Stop when attempt or time-window budgets are exhausted, progress stays below threshold, the source is not safely compressible, or required accounting data is too incomplete to support a change.
