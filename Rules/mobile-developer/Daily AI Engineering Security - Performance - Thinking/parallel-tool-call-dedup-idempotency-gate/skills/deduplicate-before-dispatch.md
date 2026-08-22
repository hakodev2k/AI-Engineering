# Skill: Deduplicate Before Dispatch

## Purpose
Prevent redundant tool executions while preserving legitimate parallelism.

## Trigger
A parsed assistant turn contains two or more tool calls.

## Inputs
Tool name, arguments, provider call ID, logical turn/session ID, tool side-effect class, and configured idempotency policy.

## Preconditions
Tool arguments must be parseable and tool metadata must identify side-effect behavior. Unknown side-effect behavior is treated conservatively.

## Required context
Only the current deduplication scope plus policy metadata. Do not load unrelated conversation history.

## Allowed tools
Deterministic JSON canonicalization, hashing, metrics/logging, and the configured dispatch layer.

## Constraints
- MUST NOT collapse calls across scopes unless policy explicitly allows it.
- MUST NOT replay cached write results by default.
- MUST NOT use provider call ID as the only logical identity.
- MUST preserve order metadata even when execution is suppressed.

## Procedure
1. Measure baseline call count, wall-clock duration, and external requests.
2. Validate every call and resolve side-effect class.
3. Canonicalize JSON arguments with stable key ordering.
4. Compute fingerprint from tool + canonical args + scope ID.
5. Group duplicate fingerprints.
6. For reads, execute one representative and map the result to duplicate logical calls when policy permits.
7. For writes, execute only when a stable idempotency rule is declared; otherwise block duplicate replay and request explicit handling.
8. Dispatch distinct calls in parallel within the configured concurrency limit.
9. Record suppression, execution, and latency metrics.
10. Compare against baseline fixtures.

## Decision points
- Unknown side-effect class: treat as non-idempotent write.
- Same provider call ID but different args: never merge; flag integrity anomaly.
- Same args in a different logical step/scope: execute unless broader dedup scope is explicitly configured.

## Expected output
Per-call decision, fingerprint, representative call, reason, and aggregate performance metrics.

## Metrics
Duplicate rate, suppressed executions, false collapses, API calls/task, p95 tool latency, wall-clock task time.

## Verification
Run `tests/fixtures.json` through `scripts/dedup_gate.py`; all expected decisions must match. Compare a recorded workload before/after and require no correctness regression.

## Failure handling
Malformed arguments or policy errors block the affected call. Do not fall back to blind parallel execution.

## Stop conditions
Stop after one deterministic classification pass. No autonomous retry loop is permitted in this skill.