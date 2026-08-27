# Hook: Post-Cycle Convergence Check

## Trigger
After every implementation/review cycle and before spawning another subagent or review lane.

## Preconditions
Cycle log contains target criterion, accepted delta, scope-growth count, actions, and verification status.

## Action
Run:
`python scripts/convergence_guard.py --log <cycle-log.json> --max-zero-delta 2 --max-scope-growth 1`

## Expected result
Exit 0 for `continue` or `complete`; exit 3 for `stop-and-escalate`; exit 2 for invalid input.

## Failure behavior
Block additional autonomous fan-out. Preserve cycle evidence and invoke failure recovery.

## Blocking
Yes.
