# Hook — Pre Autonomy Boundary Gate

## Trigger
Immediately before enabling unattended/headless execution.

## Preconditions
A fresh `observations.json` exists for the exact runtime version, surface, policy revision, and tool inventory.

## Action
Run:
```bash
python scripts/evaluate_boundary.py observations.json
```

## Expected result
Exit `0` and overall `PASS`.

## Failure behavior
- Exit `2` (`FAIL_OPEN`): block autonomy immediately.
- Exit `3` (`UNKNOWN`/invalid evidence): block autonomy.
- Exit `4` (`FAIL_CLOSED`): block rollout until availability impact is understood; do not loosen security automatically.

## Blocking
Yes. This hook is security blocking.