# Investigate Failure Isolation

## Purpose
Determine whether an outbound dependency failure can cascade through retries, resource exhaustion, queue growth, or synchronous fan-out.

## When to use
Use for repeated 5xx/timeout incidents, retry storms, dependency degradation, or before modifying resilience policies.

## Inputs
Repository root, failing dependency/operation, logs or traces, current retry/timeout configuration.

## Preconditions
Work from a clean or understood diff. Production credentials are not required. Preserve incident evidence before editing.

## Allowed tools
Repository search, tests, logs/traces, read-only dashboards, `python scripts/scan-resilience.py`.

## Constraints
Do not change production configuration, disable security controls, or increase retries to hide failures.

## Process
1. Identify outbound-call entry points and all callers.
2. Trace timeout, cancellation, retry, queue and concurrency behavior.
3. Run the deterministic scanner and retain its JSON evidence.
4. Separate transient failures from terminal failures such as authentication, validation, quota exhaustion, and malformed requests.
5. Determine retry amplification across nested libraries/services.
6. Find existing circuit-breaker, bulkhead, rate-limit and fallback policies.
7. Form one hypothesis per cascade path and validate against logs/tests.
8. Quantify blast radius: concurrent calls, retry multiplier, timeout duration, blocked workers and downstream pressure.
9. Produce findings with file/line evidence, confidence, risk and recommended action.

## Expected output
Evidence-backed findings plus a proposed isolation boundary.

## Verification
Every high-risk claim has repository or runtime evidence. Scanner output is attached or its path recorded.

## Failure handling
Retry read-only tooling at most twice for transient errors. On permission or environment failure, preserve available evidence and mark blocked.

## Stop conditions
Stop before production changes, secret changes, deployment, or any resilience change that weakens a security/availability control without explicit approval.
