# Recovery Verification Rules

## Purpose
Prevent premature incident closure by proving that customer service and system health are sustainably restored.

## Scope
Mitigation validation, backlog recovery, customer journeys, data correctness, and incident resolution.

## MUST
- Define recovery criteria that cover the original impact, critical customer journeys, error rates, latency, capacity, dependencies, and data integrity as relevant.
- Observe the system for a risk-appropriate stability window after major mitigation.
- Verify queued, delayed, retried, or failed work is reconciled or explicitly tracked.
- Confirm temporary controls and degraded modes are understood before declaring resolution.

## MUST NOT
- Resolve an incident solely because alerts stopped firing.
- Ignore latent backlog, partial regional impact, or unresolved data repair.

## SHOULD
- Use synthetic checks and representative real traffic evidence in addition to component health.

## Exceptions
An incident may transition from active response to monitored recovery when immediate impact is controlled, provided remaining risk has owners and explicit exit criteria.

## Verification
Compare recovery criteria with telemetry, end-to-end checks, backlog state, reconciliation evidence, and stability-window observations.