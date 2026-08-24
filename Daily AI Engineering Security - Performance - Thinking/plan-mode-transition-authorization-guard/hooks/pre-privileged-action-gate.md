# Hook — Pre-Privileged-Action Gate

## Trigger
Immediately before the first write, execute, commit, push, deployment, or other privileged action after planning or session resume.

## Preconditions
Current plan hash and transition ledger are available.

## Action
Validate the ledger against the current plan and requested capability.

## Script/command
`python3 scripts/transition_guard.py --ledger transition.json --plan <plan-file> --requested-mode <mode> --epoch <epoch>`

## Expected result
Exit `0` with `valid: true` only when the plan hash matches, approval is accepted, pre-mode is plan, requested mode matches the approved post-mode, and the transition epoch matches.

## Failure behavior
Exit `1` blocks the privileged action and restores/maintains planning or read-only capability. Exit `2` blocks because inputs are malformed or unreadable.

## Blocks completion
Yes. No privileged post-plan action may execute while this hook fails.
