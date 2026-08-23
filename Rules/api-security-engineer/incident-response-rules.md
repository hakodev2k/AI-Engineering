# API Security Incident Response Rules

## Purpose
Enable fast, evidence-based containment and recovery from API security incidents.

## Scope
Credential compromise, exploitation, unauthorized access, data exposure, abuse, and security-control failures.

## MUST
- Preserve relevant evidence while prioritizing containment of active harm.
- Identify affected identities, endpoints, data, time windows, and dependent systems using logs, traces, metrics, and other evidence.
- Coordinate credential revocation, blocking, rollback, or isolation through authorized incident procedures.
- Validate recovery controls and monitor for recurrence before declaring containment complete.

## MUST NOT
- Destroy evidence through ad hoc cleanup before preservation needs are considered.
- Make unsupported attribution or impact claims.
- Expose incident-sensitive details beyond authorized audiences.

## SHOULD
- Convert confirmed root causes and control gaps into tracked preventive actions and regression tests.

## Exceptions
Immediate life/safety or severe active-impact actions may precede full evidence collection under incident authority.

## Verification
Review incident timeline, evidence sources, containment actions, approvals, recovery validation, and follow-up controls.