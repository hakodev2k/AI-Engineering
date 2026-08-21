# Hook: Post-task Cleanup Verification

## Trigger
After task success, cancellation, timeout, or controlled failure.

## Preconditions
Task/session owner ID and pre-task baseline exist; resource inventory command is available.

## Action
1. Request graceful shutdown of owned task-scoped resources through the host lifecycle API.
2. Wait the configured grace period.
3. Capture a new resource snapshot.
4. Compare owned resources and aggregate usage to baseline/tolerance.
5. If owned expired resources remain, run one additional graceful cleanup cycle; force termination is permitted only for ownership-proven resources and only when configured.

## Command
Example observation: `python3 scripts/resource_snapshot.py --match codex --match node --match chrome`

## Expected result
No expired owned task-scoped resources remain, counts and memory are within configured tolerance, and persistent pools are within their steady-state budget.

## Failure behavior
A soft failure records evidence and blocks new resource creation for that owner. A hard budget breach blocks new task work. Unknown ownership prevents automatic force termination and requires escalation.

## Blocking
Yes for hard-budget violations, unknown destructive cleanup, or cleanup postcondition failure after two cycles.