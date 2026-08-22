# Circuit Breaker Recovery Assessment Skill

## Purpose
Verify that a circuit breaker fails fast under sustained dependency failure and safely recovers without retry storms, stale open state, or silent fallback corruption.

## When to use
Use when adding/changing circuit breakers, retries, timeouts, fallbacks, dependency clients, or when investigating cascading failures and slow recovery.

## Inputs
Target call path, breaker configuration, timeout/retry policies, fallback behavior, dependency SLOs, logs/metrics, tests, and `config/circuit-breaker-policy.json`.

## Preconditions
Repository is readable and the dependency boundary is identifiable. Production mutation is not required.

## Allowed tools
Repository read/search, deterministic scanner, local tests/build, read-only telemetry, disposable dependency stubs.

## Constraints
Scanner output is hypothesis only. Do not infer correctness from library defaults. Preserve timeout, retry, breaker, and fallback semantics as separate concerns.

## Procedure
1. Identify the protected dependency call and all callers sharing the breaker instance.
2. Record timeout, retry count/backoff, failure threshold, open duration, half-open probe limit, and fallback behavior.
3. Check policy ordering. Ensure total retry/timeout work is bounded and cannot keep the dependency saturated after the breaker should open.
4. Determine breaker scope: per endpoint/tenant/operation/shared client. Flag scopes where unrelated traffic can trip or reset each other.
5. Trace all failure classifications included/excluded from breaker counting; business/validation failures must not accidentally trip infrastructure breakers.
6. Run `python3 scripts/scan-circuit-breaker.py <repo> --output scan.json` and validate findings in context.
7. Design an open-state test: force consecutive qualifying failures and prove calls fail fast after the threshold.
8. Design a half-open test: advance/open-duration boundary and verify only the configured probe count reaches the dependency.
9. Design a recovery test: make the dependency healthy and prove successful probe closes/resets the breaker without a traffic burst.
10. Validate fallback semantics: fallback must be distinguishable from fresh success and must not silently violate business correctness.
11. Inspect metrics/logs for state transitions, rejected calls, probe outcomes, and recovery latency; require correlation without sensitive data.
12. Implement the smallest safe change, run focused tests/build, inspect diff, produce assessment JSON, and validate it with `scripts/validate-assessment.py`.

## Expected output
Assessment with concrete evidence, affected component, risk, recommendation, verification flags, and remaining risks.

## Verification
`pass` requires open-state, half-open, recovery, and fallback verification to all be true.

## Failure handling
Retry transient test/tool failures at most twice while preserving evidence. Deterministic failures require diagnosis or code/config change before rerun. Permission/environment failures become blocked.

## Stop conditions
Stop before approval-required actions, after two repeated transient failures, when dependency behavior cannot be safely simulated, or when production-only mutation would be required.
