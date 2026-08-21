# Circuit Breaker Safety Rules

## MUST
- Define explicit timeout, retry, breaker threshold, open duration, half-open probe limit, and fallback behavior for the protected path.
- Bound combined retry and timeout work so a single request cannot outlive its intended budget.
- Verify breaker state transitions with tests or equivalent deterministic evidence.
- Keep failure classification explicit; business/validation failures must not trip infrastructure breakers unless intentionally designed.
- Expose observable state transitions, rejected calls, probes, and recovery signals without secrets.
- Require human approval for production config/deployment, breaking API changes, security-control changes, or large dependency upgrades.
- Record unresolved risks in the final assessment.

## MUST NOT
- Use unbounded retries around or inside a breaker.
- Treat fallback output as ordinary fresh success when it may be stale, partial, or degraded.
- Allow unlimited half-open probes.
- Share one breaker across unrelated dependencies/tenants/operations without evidence that the scope is correct.
- Disable timeouts to reduce breaker trips.
- Mutate production settings or dependency infrastructure without explicit approval.
- Suppress failing tests or telemetry to obtain a pass verdict.

## SHOULD
- Prefer deterministic dependency stubs/fault injection for state-transition tests.
- Separate timeout, retry, circuit breaker, and fallback responsibilities.
- Add jitter/bounded backoff where retries are appropriate.
- Emit recovery latency and rejected-call counters.
- Keep changes local to the affected resilience policy and call path.
