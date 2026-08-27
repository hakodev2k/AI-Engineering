# Recovery

## Purpose
Make database recovery predictable under failure and incident pressure.

## Scope
Point-in-time recovery, full restore, partial restore, failover recovery, and recovery validation.

## MUST
- Recovery procedures MUST define target RPO/RTO, prerequisites, dependencies, authority, and validation steps.
- Critical databases MUST undergo periodic recovery exercises using representative backups.
- Restored data MUST be validated for consistency and application usability before service is declared recovered.
- Recovery actions that overwrite or discard data MUST require explicit human approval.

## MUST NOT
- MUST NOT improvise destructive recovery commands in production without preserving available evidence and recovery options.
- MUST NOT declare recovery complete solely because the database accepts connections.
- MUST NOT assume backup success implies recoverability.

## SHOULD
- Recovery runbooks SHOULD include decision points for restore versus failover and escalation thresholds.
- Exercises SHOULD measure actual RPO/RTO and record bottlenecks.

## Exceptions
Emergency deviations require an incident commander or authorized owner, documented rationale, and retrospective validation.

## Verification
Review exercise records, measured recovery times, restored checksums or consistency checks, application validation, runbooks, and approval evidence.