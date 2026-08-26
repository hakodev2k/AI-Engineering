# Disaster Recovery

## Purpose
Ensure critical ML platform state and capabilities can recover from major failures.

## Scope
Registries, metadata, artifact stores, feature systems, orchestration state, configuration, and serving dependencies.

## MUST
- Critical state MUST have defined RPO/RTO based on user and business impact.
- Backups MUST be restorable, not merely present.
- Recovery procedures MUST include dependency ordering, identity/configuration restoration, and integrity validation.
- Recovery tests MUST occur at a frequency proportional to risk.

## MUST NOT
- Backup success MUST NOT be treated as recovery proof without restore testing.
- Disaster recovery MUST NOT depend on credentials or documentation available only inside the failed boundary.

## SHOULD
- Recovery exercises SHOULD include loss of an entire failure domain where architecture claims such resilience.

## Exceptions
Unrecoverable derived data requires documented recomputation time and accepted impact.

## Verification
Perform restore drills, measure RPO/RTO, verify artifact integrity, inspect backup policy, and test access to recovery procedures.