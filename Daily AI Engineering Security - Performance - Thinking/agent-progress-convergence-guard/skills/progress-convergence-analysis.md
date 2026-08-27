# Skill: Progress Convergence Analysis

## Purpose
Determine whether a long-running agent workflow is measurably converging toward accepted deliverables.

## Trigger
Second work cycle, subagent fan-out, repeated review, or any report of “still working” without a new accepted artifact.

## Inputs
Goal, acceptance criteria, cycle log, artifact references, test results, blocker list, approved scope.

## Preconditions
Acceptance criteria are explicit enough to evaluate. If not, freeze new scope and derive only observable acceptance checks from the original request.

## Required context
Facts, assumptions, evidence references, deliverables, blockers, scope changes, verification status. Do not request hidden chain-of-thought.

## Allowed tools
Repository reads, tests, diff/stat inspection, CI results, deterministic guard script.

## Constraints
- MUST distinguish process activity from accepted production delta.
- MUST NOT count a new plan/review task as implementation progress unless it directly satisfies an acceptance criterion.
- MUST NOT expand scope without explicit approval or a documented blocking dependency.
- MUST use bounded retries.

## Procedure
1. Capture baseline accepted deliverables before the cycle.
2. Record intended deliverable delta.
3. After execution, identify concrete changed artifacts and test/evidence results.
4. Ask an independent verifier to mark each claimed delta accepted/rejected.
5. Record blockers resolved/introduced.
6. Record scope-growth events.
7. Run `scripts/convergence_guard.py`.
8. Continue only when the gate permits it.
9. If zero-delta threshold is reached, invoke failure recovery rather than spawning more work.

## Decision points
Continue on verified delta and remaining acceptance work. Complete only when all required acceptance criteria are verified. Stop and escalate on unapproved scope growth, exhausted retries, or repeated zero-delta cycles.

## Expected output
Structured cycle record plus gate decision.

## Metrics
Accepted deltas/cycle, zero-delta streak, retry count, scope-growth count, verification coverage.

## Verification
Independent verifier must be distinct from the implementing agent for high-impact changes.

## Failure handling
Preserve cycle evidence, freeze fan-out, use `workflows/failure-recovery.md`.

## Stop conditions
Two consecutive zero-delta cycles by default; retry budget exhausted; unsafe/irreversible action requires approval; acceptance evidence unavailable.
