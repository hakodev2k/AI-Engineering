# Resilience and Circuit Breaking

## Purpose
Contain upstream failures and preserve gateway capacity during partial outages.

## Scope
Circuit breakers, load shedding, health decisions, fallback, and dependency isolation.

## MUST
- Resilience policies MUST define failure signals, thresholds, recovery behavior, and observable state.
- Load shedding MUST protect critical gateway resources before saturation causes uncontrolled failure.
- Fallback behavior MUST preserve contract correctness and data safety.
- Recovery behavior MUST be tested, not only failure activation.

## MUST NOT
- MUST NOT return fabricated success data as a fallback.
- MUST NOT use a circuit breaker that masks persistent dependency failure from monitoring.
- MUST NOT allow one failing upstream to exhaust shared gateway resources.

## SHOULD
- Bulkheads or equivalent isolation SHOULD separate materially different failure domains.
- Recovery SHOULD avoid synchronized retry storms.

## Exceptions
Exceptions require documented dependency characteristics, evidence, residual risk, and rollback strategy.

## Verification
Perform fault injection, saturation tests, circuit-state inspection, recovery tests, metrics review, and trace analysis.