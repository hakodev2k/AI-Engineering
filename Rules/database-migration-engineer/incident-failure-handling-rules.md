# Incident and Failure Handling

## Purpose
Contain migration failures without compounding production damage.

## Scope
Covers unexpected errors, degraded service, corruption indicators, lag, lock incidents, and failed cutovers.

## MUST
- Operators MUST stop or throttle migration activity when predefined abort thresholds are reached.
- Suspected corruption or uncontrolled write divergence MUST be treated as a correctness incident until bounded by evidence.
- Failure handling MUST preserve logs, timestamps, commands, metrics, and relevant state for diagnosis.

## MUST NOT
- MUST NOT repeatedly retry a destructive or state-changing operation without understanding whether prior attempts partially succeeded.
- MUST NOT conceal migration-caused degradation to preserve schedule commitments.

## SHOULD
- Prefer containment before optimization during active incidents.
- Establish incident ownership and communication paths before high-risk cutovers.

## Exceptions
Continuing through a known failure requires incident authority, explicit rationale, bounded risk, and monitoring.

## Verification
Review abort behavior, incident records, telemetry, command history, reconciliation, and post-incident corrective actions.