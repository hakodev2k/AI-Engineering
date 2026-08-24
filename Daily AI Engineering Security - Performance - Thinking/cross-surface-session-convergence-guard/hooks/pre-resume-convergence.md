# Hook: Pre-Resume Convergence

## Trigger
Immediately before a resumed surface starts a new model turn or enables write-capable tools.

## Preconditions
JSON snapshots have been captured.

## Action
`python scripts/convergence_check.py <canonical.json> <surface1.json> [surfaceN.json ...]`

## Expected result
Exit `0` and `status=PASS`.

## Failure behavior
Exit `2` blocks resume. Exit `1` blocks write-capable continuation because the check itself is invalid.

## Blocks completion
Yes, for any resumed surface that can mutate external state.