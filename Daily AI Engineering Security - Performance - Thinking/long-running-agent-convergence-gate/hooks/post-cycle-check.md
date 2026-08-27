# Hook: Post-Cycle Convergence Check

## Trigger
After every implementation or review cycle.

## Preconditions
Progress ledger and policy are present.

## Action
Run:
`python scripts/convergence_guard.py --ledger <ledger.json> --policy config/convergence-policy.json`

## Expected result
Exit 0 with `continue_bounded` or `complete`; exit 3 with a deterministic stop decision.

## Failure behavior
Exit 3 blocks new subagents and reviews and triggers `workflows/failure-recovery.md`.

## Blocks completion
Yes.
