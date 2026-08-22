# Hook — Pre Side-Effect Gate

## Trigger
Immediately before any capability classified as side-effecting by `config/policy.json`.

## Preconditions
The caller supplies session ID, expected/current revision, logical operation ID, action fingerprint, and current receipt state.

## Action
Invoke `scripts/session_revision_gate.py` with the action record and policy. Block execution unless the result is `allow` or `already_committed`.

## Script/command
`python3 scripts/session_revision_gate.py examples/action.json --policy config/policy.json`

## Expected result
Exit `0` for `allow`, `10` for `already_committed`, `20` for `reconcile`, `30` for `block`, and `2` for invalid input.

## Failure behavior
`reconcile`, `block`, invalid input, or script failure prevents the external mutation. `already_committed` returns the prior receipt to the caller rather than re-executing.

## Blocks completion
Yes for unresolved side-effecting actions. Read-only work is outside this blocking hook.
