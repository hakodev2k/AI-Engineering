# Skill: Compression Budget Analysis

## Purpose
Diagnose whether a context-compression failure is caused by real compressor failure, insufficient progress, reactive retry exhaustion, or accidental consumption of a shared lifetime budget by successful maintenance compactions.

## Trigger
Run when long agent sessions repeatedly compact, hit 413/context-overflow errors, terminate after a fixed number of compactions, or spend excessive tokens on compression retries.

## Inputs
Compression events, pre/post token pressure, path type, model response after compaction, error identifiers, configured limits, session/turn boundaries.

## Preconditions
Compression telemetry distinguishes maintenance from reactive recovery and can observe the next model result.

## Required context
Only counters and redacted telemetry. Raw conversation content is not required for budget analysis.

## Allowed tools
Logs, metrics, deterministic script, unit tests, benchmark fixtures.

## Constraints
- MUST establish a baseline before changing counters.
- MUST NOT remove all retry/absolute caps.
- MUST NOT classify compressor return alone as verified success when policy requires a successful following model call.
- SHOULD prefer actual provider token usage when available; otherwise use a consistent estimator.

## Procedure
1. Capture baseline counts for maintenance compactions, failed/no-progress attempts, reactive retries, terminal failures, and tokens/model calls spent.
2. Label each compression event as `maintenance` or `reactive`.
3. Calculate progress ratio `(before-after)/before` and compare with the configured threshold.
4. Verify materially reduced events against the next model result.
5. Reconstruct failure streak, reactive retry count per error, and absolute total count with `scripts/compression_budget_guard.py`.
6. Identify whether a successful maintenance cycle incorrectly consumed failure budget or whether genuine no-progress retries exceeded bounds.
7. Implement separate counters/state transitions.
8. Replay long fixtures with four or more verified maintenance cycles plus explicit failing fixtures.
9. Compare before/after terminal failures, retries, token spend, and recovery rate.

## Decision points
- Material reduction + next model success: verified maintenance success; failure streak may reset.
- Material reduction + next model error: not verified; increment failure evidence according to policy.
- Insufficient reduction: failure/no-progress.
- Reactive retries above per-error limit: stop.
- Absolute total event cap exceeded: handoff/stop even if earlier maintenance succeeded.

## Expected output
Baseline, reconstructed budget state, root cause, changed state machine, before/after metrics, verification result.

## Metrics
Recovery success rate, false terminal failures, compression-related model calls/tokens, no-progress attempts, maintenance cycles sustained, latency added by retries.

## Verification
Unit tests plus a long synthetic or recorded fixture. Improvement is not claimed until measured.

## Failure handling
If token telemetry is unreliable, do not tune thresholds blindly; first repair measurement or use message/byte pressure only as explicitly labeled estimates.

## Stop conditions
Maximum two diagnose/change/re-measure cycles for the same hypothesis. Escalate if metrics do not improve or safety bounds would need to be weakened.
