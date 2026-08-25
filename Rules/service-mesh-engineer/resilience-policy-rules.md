# Resilience Policy
## Purpose
Prevent local failures from becoming distributed outages.
## Scope
Retries, timeouts, circuit breaking, connection pools, outlier detection, and failover.
## MUST
- Resilience policies MUST be derived from dependency SLOs and request budgets.
- Retry attempts MUST be bounded and limited to operations safe to repeat.
- Circuit breaking thresholds MUST be validated under realistic load.
## MUST NOT
- MUST NOT retry non-idempotent operations without an explicit safety mechanism.
- MUST NOT configure timeouts longer than upstream deadlines without justification.
- MUST NOT treat failover as safe until capacity and data semantics are verified.
## SHOULD
- Failure policies SHOULD prefer fast bounded degradation over unbounded queueing.
## Exceptions
Exceptions require measured evidence and documented failure consequences.
## Verification
Use fault-injection tests, load tests, latency traces, retry metrics, and dependency failure simulations.