# Recovery Validation Rules

## Purpose
Verify that systems return to a known-correct state after injected failures and that recovery mechanisms actually meet resilience expectations.

## Scope
Applies to automatic recovery, failover, restart, rebalancing, replay, reconciliation, and operator-driven restoration.

## MUST
- Experiments MUST validate recovery after fault removal, not only behavior during the fault.
- Recovery criteria MUST include service health and relevant data or state correctness.
- Recovery time MUST be measured against documented objectives when such objectives exist.
- Residual degraded state, stuck work, orphaned resources, or delayed backlogs MUST be checked explicitly.

## MUST NOT
- A service process becoming reachable MUST NOT alone be treated as full recovery.
- Cleanup steps MUST NOT conceal recovery defects that the system is expected to handle automatically.
- Data inconsistency discovered after an experiment MUST NOT be dismissed without investigation.

## SHOULD
- Recovery validation SHOULD include downstream consumers and asynchronous processing paths.
- Repeated experiments SHOULD compare recovery trends over time.

## Exceptions
When end-to-end correctness cannot be checked directly, use documented proxy invariants with known limitations and reviewer acceptance.

## Verification
Inspect recovery timestamps, correctness checks, backlog and saturation metrics, dependency health, cleanup records, and objective comparisons.