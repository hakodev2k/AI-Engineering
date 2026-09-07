# Resilience Rules

## Purpose
Prevent localized failures from becoming cascading service outages.

## Scope
Applies to overload, dependency failure, retries, timeouts, graceful degradation, and shutdown.

## MUST
- Services MUST define finite timeout budgets across synchronous dependency chains.
- Concurrency, queues, pools, and retry attempts MUST be bounded.
- Overload behavior MUST protect critical work through backpressure, rejection, shedding, or prioritization as appropriate.
- Retry amplification across layers MUST be analyzed and controlled.
- Shutdown MUST stop new work appropriately and allow bounded completion or safe handoff of in-flight work.

## MUST NOT
- MUST NOT use unbounded retries, queues, or concurrency as a reliability strategy.
- MUST NOT treat circuit breakers as substitutes for capacity planning or correct timeout design.
- MUST NOT claim resilience without testing relevant failure modes.

## SHOULD
- Design graceful degradation around explicit business priorities.
- Isolate independent failure domains with bulkheads where shared resources create cascade risk.

## Exceptions
Fail-fast behavior is preferred when fallback would return misleading or unsafe results; document the trade-off.

## Verification
Use fault injection, load and saturation tests, dependency outage tests, retry-volume metrics, pool/queue telemetry, shutdown tests, and recovery-time observations.