# Workflow: Converge on Terminal Objective

## Trigger
Task longer than expected, repeated validation/review, context compaction, low evidence gain, repeated delegation, or a phase transition such as commit/deploy/live verification.

## Goal
Reach the user-authorized terminal objective or one precise external blocker with bounded time/tool/delegation loops.

## Inputs
Terminal objective, acceptance criteria, authority/constraints, action ledger, evidence references, elapsed time/token/tool metrics.

## Baseline
Record current phase, original bug/requirement status, open blockers, completed phases, settled decisions, action count, duplicate signatures, elapsed time, and available token/time budget.

## Context
Persist only observable state: Facts, Assumptions, Evidence, Hypotheses, Decisions, Risks, Verification status, current phase, and next decisive action.

## Stages
1. **Observe** — reconstruct the terminal state and confirm settled decisions.
2. **Measure baseline** — calculate current duplicate/low-gain counts and elapsed resource usage.
3. **Diagnose** — choose the single blocker/uncertainty preventing the next phase.
4. **Form hypothesis** — specify one decisive action and its expected gain/result branches.
5. **Execute** — run the action or bounded implementation slice.
6. **Measure again** — record actual gain and state transition.
7. **Convergence check** — if gain is zero twice for the same uncertainty, change strategy; never run a third similar probe.
8. **Phase verify** — independent verifier checks evidence before advancing high-impact phase claims.
9. **Complete** — terminal objective verified or exact external blocker emitted.

## Responsible agent
Primary agent executes; Convergence Verifier independently reviews terminal-state transitions.

## Tools
Task-specific tools plus `scripts/action_ledger_check.py` and structured state files.

## Outputs
Updated terminal-state JSON, action ledger, before/after convergence metrics, verifier report.

## Checkpoints
- After compaction: terminal objective and settled decisions restored.
- Before expensive action: target uncertainty and expected gain recorded.
- After two zero-gain actions: strategy changes.
- Before status claim: corresponding observable state exists.

## Metrics
Evidence gain/tool call, duplicate action rate, low-gain streak length, reopened decisions, phase transitions/hour, tokens per verified phase, rework count.

## Retry policy
At most two strategy revisions per uncertainty and at most two independent review rounds for the same unchanged artifact unless new evidence appears.

## Stop conditions
Terminal objective verified; precise external blocker; no action with expected gain >=1; approval/safety boundary; or bounded strategy/review budget exhausted.

## Failure path
Return to the decisive path, preserve current evidence, stop recursive delegation/review, and state the exact blocker rather than inventing more probes.

## Verification
Independent verifier samples the ledger and confirms terminal-status language against actual tool state.

## Definition of Done
Terminal phase is verified or precise blocker exists; no forbidden repeated zero-gain probe; decisions are not reopened without contradiction; metrics are captured; status claims match tool state; required safety/approval checks remain intact.