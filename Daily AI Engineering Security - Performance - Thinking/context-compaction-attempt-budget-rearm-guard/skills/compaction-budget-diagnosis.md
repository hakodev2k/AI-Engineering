# Compaction Budget Diagnosis Skill

## Purpose
Determine whether a context-compression retry budget distinguishes failed/no-progress attempts from successful maintenance compactions and re-arms only after measurable progress.

## Trigger
Use when long turns fail with max-compression-attempt errors, when integrating a custom context engine, or when compression telemetry shows repeated successful compactions.

## Inputs
JSONL trace containing compaction attempts/results, prompt-token observations, thresholds, request success/failure, and budget state when available.

## Preconditions
Trace timestamps/order MUST be reliable enough to reconstruct a single turn.

## Required context
Configured context limit, compression threshold, attempt cap, active context engine, and fallback policy.

## Allowed tools
Read-only logs/configuration and `scripts/check_compaction_budget.py`.

## Constraints
- MUST preserve bounded failure retries.
- MUST NOT re-arm solely because `compress()` returned without exception.
- MUST require measurable reclaimed tokens and a successful subsequent request below threshold for verified progress.
- MUST treat plugin engines through public result fields, not private attributes.

## Procedure
1. Establish baseline: attempts/turn, successful compactions, failures, reclaimed tokens, max-attempt terminations, tokens/task, and latency.
2. Partition attempts into failed, no-progress, and successful-progress classes.
3. For each successful compaction, verify `after_tokens < before_tokens` and threshold clearance when claimed.
4. Verify a subsequent successful model request occurs below threshold before the failure budget is re-armed.
5. Detect successful progress events that leave the failure counter exhausted.
6. Detect unsafe re-arms lacking measured progress.
7. Compare built-in and plugin-engine traces with identical semantics.
8. Produce root-cause evidence and a contract-level remediation recommendation.

## Decision points
- Failure/no progress: consume retry budget.
- Measurable reduction but still above threshold: do not re-arm; continue within bounded budget.
- Measurable reduction, threshold cleared, subsequent request succeeds: re-arm failure budget.
- Missing required telemetry: mark unverifiable and block a verified claim.

## Expected output
Machine-readable trace verdict plus a short diagnostic summary of violations, maximum consecutive failed attempts, successful re-arms, and unresolved gaps.

## Metrics
Max-attempt terminations per 100 long turns, successful compactions before termination, tokens reclaimed/compaction, compression latency, tokens/task, failure-budget utilization, and unsafe/missed re-arms.

## Verification
Replay synthetic traces covering valid re-arm, no-progress exhaustion, plugin success, and unsafe reset. Compare before/after runtime traces after integration.

## Failure handling
Malformed traces fail with a nonzero exit code. Missing telemetry is not assumed to be success. Retry trace collection at most once for an instrumentation failure.

## Stop conditions
Stop when every compaction cycle has a classified result and the trace has a deterministic pass/fail verdict, or after one failed recollection attempt.
