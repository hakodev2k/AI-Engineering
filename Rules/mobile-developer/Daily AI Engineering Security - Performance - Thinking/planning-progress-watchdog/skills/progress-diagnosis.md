# Skill: Progress Diagnosis

## Purpose
Determine whether an agent is moving toward the requested deliverable or cycling through meta-work.

## Trigger
Run after plan approval, after two meta-only actions, before another replan/review, and before completion.

## Inputs
Goal, acceptance criteria, event log, changed files/artifacts, test results, requirement-change evidence.

## Preconditions
Acceptance criteria are explicit enough to evaluate; events are timestamped and classified when possible.

## Required context
Only the active goal, current acceptance gates, last approved plan hash/version, and events since the last measurable deliverable delta.

## Allowed tools
Read repository state, diffs, test output, event logs, and watchdog script. No destructive action is required.

## Constraints
Do not infer progress from prose volume. Planning/review/status artifacts count as meta-work unless they are themselves the requested deliverable.

## Procedure
1. Record facts: current goal, required deliverable, acceptance gates.
2. Find the most recent event that changed the deliverable or produced acceptance evidence.
3. Count consecutive meta-only events after that point.
4. Determine whether requirements changed after plan approval; require evidence, not speculation.
5. Run `scripts/progress_watchdog.py` with `config/watchdog.json`.
6. If decision is `continue`, proceed to implementation or verification.
7. If `transition_required`, stop meta-work and execute the smallest approved implementation step.
8. If `blocked`, report the exact conflict/evidence and stop autonomous retries.
9. Before completion, verify all acceptance gates independently.

## Decision points
- Replan is permitted only for a material requirement/evidence change.
- More review is permitted only if it can produce new acceptance evidence or resolve a known defect.
- After the configured meta-action limit, implementation/verification or escalation is mandatory.

## Expected output
Facts, latest deliverable delta, meta-action count, requirement-change status, decision, next allowed phase, and unsatisfied gates.

## Metrics
Meta-only streak, plan regenerations, deliverable deltas, verification coverage, completion-gate pass rate.

## Verification
A separate verifier confirms that the claimed deliverable delta exists and the next phase is allowed.

## Failure handling
Malformed/missing event data blocks completion and returns `invalid`; do not guess.

## Stop conditions
Stop when all gates pass, a blocking dependency requires human input, or maximum recovery attempts are exhausted.
