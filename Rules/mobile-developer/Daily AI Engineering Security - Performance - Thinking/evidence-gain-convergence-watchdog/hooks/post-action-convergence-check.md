# Hook: Post-Action Convergence Check

## Trigger
After every significant investigation, validation, build, test, deployment, or state-changing tool action; also after context compaction.

## Preconditions
`convergence-ledger.json` contains terminal objective, baseline, elapsed time, and structured actions with evidence-gain fields.

## Action
Run `python3 scripts/convergence_watchdog.py convergence-ledger.json --soft-ratio 2 --hard-ratio 5`.

## Expected result
Exit 0. Warnings require REPLAN before another equivalent probe; a clean result permits continued execution.

## Failure behavior
Exit 2 blocks because evidence is malformed. Exit 3 blocks the current investigative branch because hard overrun or three consecutive no-gain actions were detected.

## Blocking
Yes for the affected branch and completion claims. The hook does not weaken safety or force deployment; it requires precise replan/blocker evidence instead of unbounded looping.