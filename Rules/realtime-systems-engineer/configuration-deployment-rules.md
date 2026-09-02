# Configuration and Deployment Rules

## Purpose
Prevent configuration or rollout changes from invalidating timing and safety assumptions.

## Scope
Scheduler settings, priorities, affinities, clocks, kernel/runtime settings, feature flags, firmware, and deployment parameters.

## MUST
- Timing-sensitive configuration MUST be versioned, reviewed, and traceable to the software and hardware version it supports.
- Production deployment MUST verify scheduler, priority, affinity, clock, and resource settings required by the timing model.
- Configuration changes that can affect timing or safety MUST be tested before production and MUST require explicit approval when high risk.
- Rollback criteria and recovery steps MUST be defined before a production change where rollback is possible.

## MUST NOT
- MUST NOT change production timing parameters manually without traceability and authorization.
- MUST NOT assume environment defaults are equivalent across targets.

## SHOULD
- Prefer configuration-as-code and automated drift detection.

## Exceptions
Emergency changes require documented incident context, approver, observed evidence, and post-change reconciliation.

## Verification
Inspect configuration diffs, deployment records, environment checks, drift reports, timing tests, and rollback evidence.