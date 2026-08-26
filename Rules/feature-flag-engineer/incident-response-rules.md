# Incident Response Rules

## Purpose
Use feature flags safely during incidents while preserving evidence and authority boundaries.

## Scope
Emergency disablement, mitigation, rollback, and incident investigation.

## MUST
- Responders MUST verify flag identity, intended effect, current state, and blast radius before mutation when time permits.
- Emergency mutations MUST be timestamped and attributable.
- Incident mitigation MUST prioritize containment and reversibility.
- Post-incident review MUST determine whether flag design, defaults, telemetry, or permissions contributed to impact.

## MUST NOT
- Responders MUST NOT make unrelated flag changes during an incident without justification.
- A successful toggle MUST NOT be treated as root-cause proof.
- Incident changes MUST NOT be left undocumented after stabilization.

## SHOULD
- Runbooks SHOULD include tested flag-based mitigations and verification signals.

## Exceptions
Immediate life, safety, security, or severe availability threats may justify abbreviated prechecks under authorized incident policy.

## Verification
Inspect incident timelines, audit logs, runbooks, telemetry, postmortems, and follow-up actions.