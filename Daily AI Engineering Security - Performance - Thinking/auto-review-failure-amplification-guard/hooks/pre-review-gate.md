# Hook: Pre-review Gate

## Trigger
Immediately before an automatic approval/reviewer model call for an escalated retry.

## Preconditions
Operation scope, failure text/code, requested permission, and counter-state path are available.

## Action
Run:
`python scripts/review_amplification_guard.py gate --event <event.json> --state <state.json> --max-repeats 3 --window-minutes 30`

## Expected result
Exit 0 = normal review may proceed. Exit 2 = repeated internal-failure fingerprint exceeded budget; block automatic review and require sandbox-health validation/human handling. Exit 1 = invalid input or unsafe ambiguity; block automatic completion.

## Failure behavior
Any malformed input, missing scope classification, or state corruption fails closed. The hook never grants broader permission itself.

## Blocks completion
Yes when exit code is non-zero until the failure is resolved or explicitly handled by a human.