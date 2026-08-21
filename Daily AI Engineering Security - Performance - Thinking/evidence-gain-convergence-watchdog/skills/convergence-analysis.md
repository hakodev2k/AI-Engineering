# Skill: Convergence Analysis

## Purpose
Detect whether an agent is making measurable progress toward the terminal objective or consuming resources without evidence gain.

## Trigger
At task start, after each validation/investigation tool call, after compaction, or when elapsed/token/tool-call budget crosses a configured checkpoint.

## Inputs
Terminal objective, phase plan, settled decisions, unresolved blockers, tool-call ledger, elapsed time, token/tool-call counts, baseline estimate.

## Preconditions
Each significant tool call records the uncertainty it intended to resolve and its observed evidence delta.

## Allowed tools
Read-only ledger analysis, time/token counters, duplicate-command normalization, phase-state validation.

## Constraints
Do not request hidden chain-of-thought. Use only observable facts, decisions, hypotheses, evidence, and state transitions. Safety blockers remain valid even when they slow convergence.

## Procedure
1. Persist the terminal objective and authorized lifecycle phases.
2. Record settled user decisions separately from assumptions.
3. For each tool call, capture `question`, `expected_evidence`, `actual_evidence`, `phase_effect`, and normalized signature.
4. Mark evidence gain as `none`, `low`, or `material` using observable phase/blocker changes.
5. Detect repeated signatures or semantically equivalent probes with no material evidence gain.
6. Compare elapsed/time/token/tool-call use against configured checkpoints and baseline.
7. If two consecutive actions produce no material evidence gain, require a strategy change.
8. If three such actions occur within one phase, stop that investigative branch and escalate/replan.
9. Validate progress wording against actual phase state.
10. Before completion, verify every terminal phase has evidence or one precise external blocker.

## Decision points
- New contradictory evidence may reopen a settled decision; narration alone may not.
- A safety/security blocker can stop progression even with high cost, but must be precise and evidenced.
- Repeated tests are allowed after a relevant change; identical reruns without a changed hypothesis count as no gain.

## Expected output
A structured convergence report with terminal goal, phase state, evidence-gain rate, repeated-probe count, budget status, blockers, and CONTINUE/REPLAN/STOP/COMPLETE verdict.

## Metrics
Material-evidence-gain per tool call, duplicate/no-gain call ratio, time-to-first-useful-change, time-to-terminal-phase, token-to-evidence ratio, reopened-settled-decision count, unsupported-progress-claim count.

## Verification
An independent verifier checks that ledger entries correspond to actual tool outputs/phase state and that completion claims have evidence.

## Failure handling
One replan after two no-gain actions; maximum two replans for the same blocker. After that, stop with the precise blocker and evidence.

## Stop conditions
Three no-gain actions in a phase, two failed replans for the same blocker, resource budget hard limit, or a verified external blocker that cannot be changed within scope.