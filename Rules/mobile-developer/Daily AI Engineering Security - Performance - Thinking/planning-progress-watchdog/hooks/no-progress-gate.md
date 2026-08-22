# Hook: No-Progress Gate

## Trigger
Before another planning/review action after plan approval, and before final completion.

## Preconditions
`events.json` contains ordered task events and `config/watchdog.json` is present.

## Action
Run the deterministic watchdog and block disallowed phase transitions.

## Command
`python3 scripts/progress_watchdog.py events.json --config config/watchdog.json --strict`

## Expected result
Exit `0` when the next phase is allowed. JSON output includes decision, meta streak, deliverable deltas, and unsatisfied gates.

## Failure behavior
Exit `3` blocks another meta-only action or completion. Exit `2` blocks on invalid/missing evidence. Do not weaken thresholds to make the hook pass.

## Blocks completion
Yes. Completion requires valid evidence and all acceptance gates passing.
