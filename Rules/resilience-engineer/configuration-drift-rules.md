# Configuration and Drift Rules

## Purpose
Prevent inconsistent configuration and hidden drift from undermining redundancy, failover, and recovery.

## Scope
Applies to application settings, infrastructure configuration, routing, quotas, resilience policies, feature controls, and recovery environments.

## MUST
- Resilience-critical configuration MUST be versioned, reviewable, and attributable where the platform permits.
- Redundant environments MUST be checked for material configuration differences that affect failover behavior.
- Runtime overrides MUST have an owner, reason, expiry or review condition, and audit trail.
- Configuration changes affecting timeouts, retries, health checks, capacity, routing, failover, or data safety MUST be validated before broad rollout.
- Drift capable of defeating recovery objectives MUST be detectable.

## MUST NOT
- MUST NOT rely on undocumented manual configuration as a required disaster-recovery step.
- MUST NOT assume nominally identical environments are equivalent without comparing resilience-critical state.
- MUST NOT leave emergency overrides permanently enabled without explicit review.

## SHOULD
- Configuration SHOULD be generated or enforced from declarative sources where practical.
- Drift checks SHOULD run automatically for critical environments.

## Exceptions
Temporary manual changes during incidents are permitted under incident authority but MUST be recorded, validated, and reconciled with the source of truth afterward.

## Verification
Compare declared and runtime configuration, inspect audit history, run drift detection, and validate critical settings across fault domains and recovery environments.