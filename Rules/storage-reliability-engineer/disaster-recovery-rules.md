# Disaster Recovery Rules

## Purpose
Ensure storage can be recovered from site, region, control-plane, and correlated failures.

## Scope
Applies to multi-site replication, recovery orchestration, failover, failback, and recovery dependencies.

## MUST
- Define recovery sequence, dependencies, authority, and success criteria.
- Exercise regional or equivalent disaster scenarios regularly.
- Verify recovered data consistency before reopening dependent workloads.

## MUST NOT
- Assume replication alone constitutes disaster recovery.
- Perform failback without validating synchronization state and rollback options.
- Execute production disaster failover without authorized incident or change approval except where pre-authorized runbooks explicitly permit it.

## SHOULD
- Automate repeatable recovery steps while retaining human approval at destructive boundaries.
- Keep recovery documentation accessible outside the primary failure domain.

## Exceptions
Untested recovery paths require explicit risk acceptance and a time-bounded remediation plan.

## Verification
Inspect DR drills, achieved RTO/RPO, replication lag, runbooks, dependency tests, and post-exercise findings.