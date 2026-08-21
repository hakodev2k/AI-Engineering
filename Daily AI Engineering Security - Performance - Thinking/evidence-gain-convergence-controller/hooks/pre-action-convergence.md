# Hook: Pre-action Convergence Gate

## Trigger
Before an expensive tool call, full test run, review/delegation, or after compaction.

## Preconditions
Terminal objective/current phase and action ledger are available.

## Action
Require the proposed action to name a target uncertainty/criterion, signature, expected evidence gain (0–3), and decisive result branches. Run the ledger checker before repeated actions.

## Command
`python3 scripts/action_ledger_check.py action-ledger.json`

## Expected result
No convergence violation; proposed expensive action has expected gain >=1 unless it is a mandatory safety/housekeeping action.

## Failure behavior
Block a third materially similar zero-gain action, unsupported progress claim, or reopening of a settled decision without contradictory evidence. Force strategy change or precise escalation.

## Blocking
Yes. Failure blocks the repeated action, not required security/correctness verification itself.