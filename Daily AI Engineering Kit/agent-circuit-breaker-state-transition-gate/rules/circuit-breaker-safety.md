# Circuit Breaker Safety Rules

## MUST
- Classify failures before counting them toward the breaker; only configured transient/dependency failures affect the failure-rate threshold.
- Preserve timestamps, status/error class, breaker state, and transition reason as evidence.
- Enforce `minimum_requests` before opening on failure rate.
- Permit at most `half_open_max_probes` concurrent probes while half-open.
- Require `half_open_successes_to_close` successful probes before closing.
- Stop before production policy changes, disabling the breaker, or increasing failure tolerance without explicit human approval.

## MUST NOT
- Count caller validation/authentication errors as dependency-health failures unless explicitly configured.
- Retry a request merely because the circuit breaker rejected it.
- Bypass an open circuit with an alternate credential, endpoint, or permission not already approved.
- Run unbounded probes, retries, or recovery loops.
- Treat generated configuration as verified until deterministic checks and relevant tests pass.

## SHOULD
- Add jitter to upstream retries outside this gate.
- Emit state-transition metrics and structured logs.
- Keep breaker scope aligned with the actual failure domain (service/host/operation as appropriate).
