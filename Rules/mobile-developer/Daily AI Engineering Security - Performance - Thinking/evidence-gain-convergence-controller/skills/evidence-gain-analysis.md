# Skill: Evidence-Gain Analysis

## Purpose
Keep agent investigation, implementation, review, and verification loops convergent by requiring each expensive action to advance a named decision or terminal phase.

## Trigger
Before a costly tool call/review/delegation, after two similar probes, after context compaction, or when time/token usage exceeds the task's expected scale without terminal progress.

## Inputs
Terminal objective, current phase, facts, settled decisions, open hypotheses, required evidence, prior actions/results, elapsed time, token/tool-call counters.

## Preconditions
The terminal objective and acceptance criteria are explicit enough to determine whether an action changes the task state.

## Required context
Only observable state: Facts, Assumptions, Evidence, Hypotheses, Decisions, Risks, Verification status. Never request hidden chain-of-thought.

## Allowed tools
Repository/tool logs, test results, structured state ledger, duplicate-action analyzer, benchmark/timing data.

## Constraints
Do not invent new requirements to justify more work. Do not reopen a settled user decision without new contradictory evidence. Do not suppress security or correctness checks merely to increase apparent progress.

## Procedure
1. Restate the terminal state as observable phases/conditions.
2. List open uncertainties that can block those conditions.
3. For a proposed action, name the uncertainty/condition it targets and its decisive expected outcomes.
4. Estimate `expected_gain` from 0–3: 0=no state change expected; 1=weak signal; 2=material narrowing; 3=decisive pass/fail evidence.
5. Reject or batch actions with gain 0 unless they are mandatory safety/housekeeping actions.
6. Execute one action and record actual evidence/result.
7. Score `actual_gain` 0–3 by whether facts, hypotheses, blockers, or phase state changed.
8. Detect repeated action signatures and low-gain streaks.
9. After two consecutive actual-gain-0 actions against the same uncertainty, force strategy change or escalate; do not run a third similar probe.
10. Update the terminal-state ledger and continue only if unresolved blockers remain.

## Decision points
- New contradictory evidence may reopen a settled decision, but the contradiction must be recorded.
- Independent high-risk verification may be required even if it repeats a test category; it must have a distinct verifier or trust purpose.
- If no available action has expected gain >=1, stop autonomous probing and escalate the precise blocker.

## Expected output
Structured action record: objective phase, targeted uncertainty, action signature, expected gain, actual gain, evidence reference, decision change, next state.

## Metrics
Evidence gain/tool call, evidence gain/1K tokens, duplicate action rate, low-gain streaks, reopened-decision count, terminal-phase throughput, rework count.

## Verification
Independent verifier checks that sampled action records correspond to real evidence and that completion/status transitions are supported by tool state.

## Failure handling
Maximum two strategy revisions per unresolved uncertainty. If neither creates evidence gain, produce an exact blocker and stop the autonomous loop.

## Stop conditions
Terminal objective verified; precise external blocker exists; two strategy revisions fail; safety/permission boundary requires human approval; or further work has no evidence-producing action.