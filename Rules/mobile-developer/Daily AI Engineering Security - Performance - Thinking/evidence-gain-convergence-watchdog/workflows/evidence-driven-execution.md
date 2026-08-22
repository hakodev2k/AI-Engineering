# Workflow: Evidence-Driven Execution

## Trigger
Any multi-step coding, investigation, validation, release, or long-running agent task.

## Goal
Reach the terminal objective with bounded investigation loops and measurable evidence gain.

## Inputs
Terminal objective, authorized phases, settled decisions, baseline estimate, resource budgets, current ledger.

## Baseline
Record expected phases, starting reproduction state, elapsed/token/tool-call baseline, and initial blockers.

## Stages
1. Observe current phase and blocker.
2. Select one unresolved uncertainty.
3. Form a falsifiable hypothesis and expected decisive evidence.
4. Execute one tool action.
5. Record actual evidence delta and phase effect.
6. If material gain: continue to next uncertainty/phase.
7. If no gain twice: replan with a different method.
8. If no gain three times in the phase or two replans fail for one blocker: stop that branch and surface precise blocker.
9. Measure resource use at checkpoints.
10. Independently verify phase state and status language.
11. Complete only when terminal evidence is satisfied.

## Responsible agent
Implementing agent executes; `subagents/convergence-verifier.md` independently verifies.

## Tools
`scripts/convergence_watchdog.py`, task-specific build/test/deploy tools, structured ledger.

## Outputs
Ledger, resource report, phase-state report, verification verdict.

## Checkpoints
After each significant tool call, after compaction, at soft resource budget, before phase transitions, and before completion.

## Metrics
Evidence gain/tool call, no-gain ratio, duplicate probe count, elapsed/baseline ratio, tokens/evidence gain, phase completion rate, unsupported status claims.

## Retry policy
Maximum one immediate retry for transient tool failure; maximum two replans for the same blocker. Repeated validation after code/state changes does not count as duplicate.

## Stop conditions
Three no-gain actions in one phase, two failed replans for the same blocker, hard resource budget, or verified external blocker.

## Failure path
Checkpoint current state, retain exact blocker/evidence, stop the failing branch, and return a precise status. Do not invent completion or weaken verification.

## Verification
Convergence Verifier compares ledger against tool evidence and runs watchdog checks.

## Definition of Done
Original terminal objective is satisfied with evidence, or one precise external blocker is verified; loops are bounded; status is evidence-linked; resource metrics recorded; no unsupported conclusion remains.