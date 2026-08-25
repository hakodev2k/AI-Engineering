# Hook: Pre-Spawn Freshness Check

## Trigger
Immediately before child-agent spawn or resume.

## Preconditions
An epoch manifest exists and the repository root is known.

## Action
Run `python3 scripts/context_epoch_guard.py check --root <repo> --manifest <epoch.json> --json`.

## Expected result
Exit `0` and JSON containing `"fresh": true`.

## Failure behavior
Exit `3` blocks spawn and routes to the refresh workflow. Exit `2` blocks completion because inputs or policy are invalid.

## Blocking
Yes. Non-zero is a failed precondition, never advisory logging.
