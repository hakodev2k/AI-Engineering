# Skill — Retry Trace Analysis

## Purpose
Measure retry amplification per logical model turn, distinguish semantic terminal states from transient transport failures, and select a bounded retry/fallback policy from evidence.

## Trigger
Agent latency/retry regression, repeated transport fallback, excessive model calls, or any change to stream handling.

## Inputs
Turn traces with timestamps, logical turn IDs, attempt number, transport, terminal/event kind, status/error, token usage if available, success/failure outcome.

## Preconditions
At least one baseline trace set and a representative workload. Clock/timestamps must be monotonic enough to calculate durations.

## Required context
Current retry layers, timeout settings, fallback behavior, success criteria, rate-limit semantics.

## Allowed tools
Log/query tools, spreadsheets or scripts for aggregation, `scripts/retry_classifier.py`, deterministic unit tests.

## Constraints
Do not infer improvement from one fast run. Do not disable correctness/security verification. Do not retry unknown states by default.

## Procedure
1. Group attempts by logical turn ID.
2. Capture baseline p50/p95/p99 latency, attempts/turn, cumulative retry wait, fallback time, completion rate and tokens/successful task.
3. Label each terminal event as semantic terminal, transient transport, transient server/rate-limit, cancellation, or unknown.
4. Find false retries: any attempt after a non-retryable terminal state.
5. Find timeout amplification: cumulative wait dominated by repeated fixed transport timeouts.
6. Form one hypothesis at a time, e.g. “stop on response.incomplete” or “fallback after transport budget X.”
7. Encode the hypothesis in the centralized classifier/policy.
8. Replay the same workload and compare before/after metrics.
9. Accept only if retry/latency improves with no material completion-rate or correctness regression.

## Decision points
- Terminal semantic event -> STOP.
- Classified transient and budgets remain -> RETRY.
- WebSocket transient with exhausted transport budget -> FALLBACK.
- Unknown or budget exhausted -> STOP and surface evidence.

## Expected output
Baseline table, classification findings, hypothesis, policy delta, before/after metrics, regression status, verification status.

## Metrics
Attempts/turn, false-terminal retries, cumulative wait, fallback time, p95 latency, success rate, tokens/task.

## Verification
`python -m unittest tests/test_retry_classifier.py` plus workload-level before/after comparison.

## Failure handling
If event semantics are ambiguous, mark unknown and stop rather than retry blindly. Preserve trace evidence and escalate to protocol owner.

## Stop conditions
Maximum two policy revisions per investigation. Stop when target metrics improve and regressions are absent, or when evidence cannot distinguish application from transport failure.
