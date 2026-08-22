# Skill: Tool Failure Classification

## Purpose
Prevent useless retries by distinguishing transient failures from deterministic failures before another tool/model turn is spent.

## Trigger
After every failed tool call and before any retry.

## Inputs
Tool name, canonical arguments, exit/status code, error text/type, transport metadata, attempt count, prior incident records.

## Preconditions
The failure is observable and the original call metadata is available.

## Allowed tools
Read-only logs, deterministic hashing/canonical JSON, known error maps, health probes that do not repeat side effects.

## Constraints
MUST NOT retry side-effecting calls whose outcome is unknown without idempotency/reconciliation evidence. MUST NOT classify authorization/policy/validation/not-found errors as transient merely to keep the loop moving.

## Procedure
1. Canonicalize tool name and arguments.
2. Normalize the error into a stable fingerprint while preserving status/type.
3. Classify: `transient`, `deterministic`, `unknown-outcome`, or `caller-fixable`.
4. Build incident key = hash(tool + args + error class/fingerprint).
5. Count attempts and elapsed time.
6. For transient failures, allow bounded backoff retry.
7. For deterministic failures, block identical retry; require changed arguments, different tool, or new evidence.
8. For unknown-outcome side effects, reconcile before any retry.
9. Emit structured decision and fallback candidates.

## Decision points
- Same deterministic incident repeated: OPEN circuit immediately after the first repeated failure.
- Transient failure: maximum two retries by default.
- Unknown side effect: reconciliation required; no blind retry.

## Expected output
Incident ID, classification, fingerprint, attempts, next action, retry-after, evidence, and stop reason.

## Metrics
Duplicate failed calls, retries/incident, wasted latency, tokens/calls avoided, recovery success rate, false-open/false-close rate.

## Verification
Replay representative transient and deterministic fixtures through the classifier and confirm policy decisions are stable.

## Failure handling
If classification is ambiguous, choose `unknown-outcome` for side effects and `caller-fixable`/stop for read-only calls rather than unlimited retry.

## Stop conditions
Per-incident budget exhausted, repeated identical deterministic failure, unreconciled side effect, or no progress after two remediation attempts.