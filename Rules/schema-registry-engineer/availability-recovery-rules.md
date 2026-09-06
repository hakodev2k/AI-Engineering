# Availability and Recovery Rules

## Purpose
Keep registry services available and recoverable without losing schema history or authorization boundaries.

## Scope
High availability, backups, replication, disaster recovery, restore, and degraded operation.

## MUST
- Production registries MUST define availability and recovery objectives appropriate to their dependency criticality.
- Registry state required to decode retained data MUST be backed up or replicated durably.
- Recovery procedures MUST preserve schema versions, compatibility configuration, references, and access controls.
- Failover and restore procedures MUST be tested periodically.
- Recovery completion MUST include representative registration and lookup validation.

## MUST NOT
- MUST NOT declare recovery successful solely because the service process is running.
- MUST NOT restore registry data without validating version and subject integrity.
- MUST NOT bypass authorization controls during failover except under approved break-glass procedure.

## SHOULD
- Separate control-plane recovery from client read-path continuity where architecture permits.
- Keep recovery runbooks versioned and exercised.

## Exceptions
Reduced redundancy requires documented risk, duration, mitigation, and approval.

## Verification
Review backup evidence, replication health, failover drills, restore tests, and post-recovery validation.