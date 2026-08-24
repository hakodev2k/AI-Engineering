# Incident Response Rules

## Purpose
Restore database service safely while preserving evidence and minimizing secondary damage.

## Scope
Database outages, severe degradation, corruption, failover events, and recovery coordination.

## MUST
- Establish incident command, severity, communication, and decision ownership for major events.
- Preserve logs, metrics, timelines, and relevant state before destructive remediation when feasible.
- Prefer reversible mitigations and explicitly track hypotheses versus confirmed facts.
- Validate service health, data correctness, and replication after recovery.

## MUST NOT
- Do not perform high-risk production actions without clear incident authority.
- Do not declare recovery from a single green metric.

## SHOULD
- Maintain rehearsed runbooks for common high-impact failure modes.

## Exceptions
Immediate containment may precede full documentation when delay increases harm; document actions after stabilization.

## Verification
Review incident timelines, commands executed, evidence captured, validation checks, and follow-up actions.