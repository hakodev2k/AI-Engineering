# Reliability, Security & Performance

## Reliability
Use explicit timeouts, cancellation, idempotency and bounded retries. Retry only transient operations whose side effects are safe. Design degraded behavior for optional dependencies and alert on user-impacting symptoms.

## Security
Apply least privilege, server-side authorization, output encoding, parameterized data access, secret isolation, safe file handling and dependency hygiene. Treat logs as data exposure surfaces. Do not place secrets or sensitive payloads in client bundles or telemetry.

## Performance
Measure before optimizing. Track end-to-end latency, server latency, database time, payload size, client rendering, cache hit/miss and dependency time. Avoid N+1 access, unbounded result sets, synchronous blocking on hot paths and accidental retry amplification.

## Trade-off rule
When speed conflicts with safety, prefer a reversible smaller release, feature flag, staged rollout, or reduced scope rather than deleting required controls.