# Failover and Failback Rules

## Purpose
Make traffic and workload transitions predictable, safe, and reversible during failures.

## Scope
Applies to active-active, active-passive, zonal, regional, database, storage, network, and application failover mechanisms.

## MUST
- Failover criteria MUST be explicit and based on signals that distinguish real impairment from transient noise.
- The target MUST have verified capacity, compatible state, required configuration, and reachable dependencies before accepting critical load where feasible.
- Automatic failover MUST include controls against oscillation and repeated unsafe switching.
- Failback MUST be treated as a separate change with state reconciliation and risk assessment.
- Manual procedures MUST specify authority, validation steps, abort conditions, and rollback.

## MUST NOT
- MUST NOT assume failback is safe merely because failover succeeded.
- MUST NOT direct writes to multiple authorities unless consistency and conflict handling are explicitly designed.
- MUST NOT automate irreversible recovery actions without approved safeguards.

## SHOULD
- Failover SHOULD be routinely exercised under production-like load.
- Systems SHOULD prefer health evidence from critical transactions over shallow process health alone.

## Exceptions
Emergency manual failover may bypass normal change timing only under incident authority; skipped checks, risks, and post-action validation MUST be recorded.

## Verification
Review failover configuration and runbooks, execute controlled exercises, measure transition time and error rate, and verify data/state integrity before and after failback.