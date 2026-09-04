# Recovery Validation Rules

## Purpose
Prevent premature incident closure by requiring evidence that service, data, and customer experience have actually recovered.

## Scope
Applies after mitigation, rollback, vendor recovery, failover, data repair, or other actions intended to restore normal operation.

## MUST
- Define recovery criteria before declaring the incident resolved whenever practical.
- Validate recovery using customer-impact signals plus relevant technical health signals.
- Confirm that error rates, latency, throughput, saturation, queues, and critical business transactions have returned to acceptable ranges where relevant.
- Verify that no known data-integrity, security, or backlog risk remains unbounded.
- Observe the system for an appropriate stability window after the final major mitigation.
- Reopen or continue the incident if recovery evidence regresses during the validation window.

## MUST NOT
- Declare recovery solely because one deployment completed successfully.
- Close an incident because alerts stopped firing without validating customer-facing behavior.
- Ignore accumulated backlog, retries, delayed jobs, or reconciliation work that can recreate impact.

## SHOULD
- Compare recovered behavior against known healthy baselines.
- Include synthetic or end-to-end checks for critical customer journeys.

## Exceptions
For low-severity incidents, the validation window may be short when recovery is deterministic and directly observable.

## Verification
Review recovery criteria, dashboards, synthetic tests, business metrics, queue depth, data checks, and the timestamped stability window before closure.