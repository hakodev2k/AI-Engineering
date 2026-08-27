# Overload Protection Rules

## Purpose
Keep APIs predictable under demand beyond sustainable capacity and prevent cascading resource exhaustion.

## Scope
Covers admission control, concurrency limits, queues, load shedding, and graceful degradation.

## MUST
- APIs MUST define bounded behavior when demand exceeds sustainable capacity.
- Concurrency and queue limits MUST protect constrained resources from unbounded accumulation.
- Rejected work MUST fail quickly with protocol-appropriate, observable signals.
- Overload thresholds MUST be validated with capacity or load evidence.
- Critical operations MUST be prioritized explicitly when graceful degradation differentiates traffic classes.

## MUST NOT
- MUST NOT use unbounded request queues as a substitute for capacity.
- MUST NOT allow overload protection to bypass authorization or tenant isolation.
- MUST NOT silently drop accepted durable work unless the contract explicitly permits loss.

## SHOULD
- Admission control SHOULD use signals close to the actual bottleneck.
- Load shedding SHOULD preserve high-value and recovery-critical traffic where policy permits.

## Exceptions
Exceptions require capacity evidence, bounded resource analysis, failure-mode documentation, compensating controls, and review.

## Verification
Use stress/load tests, queue-depth metrics, saturation dashboards, rejection metrics, dependency traces, and fault injection to confirm bounded behavior.