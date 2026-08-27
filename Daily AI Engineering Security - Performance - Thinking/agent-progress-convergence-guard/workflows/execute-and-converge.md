# Workflow: Execute and Converge

## Trigger
A task requires more than one implementation cycle or uses subagents.

## Goal
Converge on verified deliverables without unbounded process expansion.

## Inputs
Goal, acceptance criteria, approved scope, baseline artifacts.

## Baseline
Record already-accepted deliverables and unresolved blockers before work begins.

## Context
Facts, assumptions, evidence, hypotheses, decision, risks, verification status.

## Stages
1. **Observe:** capture current accepted state.
2. **Measure baseline:** record deliverables, blockers, cycle counters.
3. **Diagnose:** choose one blocking gap.
4. **Form hypothesis:** identify the smallest implementation likely to close that gap.
5. **Implement:** make the bounded change.
6. **Measure again:** run deterministic tests/checks.
7. **Independent verify:** verifier accepts/rejects claimed delta.
8. **Gate:** run convergence guard.
9. **Improved?** If no, re-evaluate at most twice. If yes, continue to next required criterion or complete.

## Responsible agent
Coordinator owns scope; implementer owns change; verification agent owns acceptance.

## Tools
Repository tools, test runners, `scripts/convergence_guard.py`.

## Outputs
Cycle log, accepted delta, blocker delta, decision.

## Checkpoints
Before implementation, after tests, after independent verification.

## Metrics
Accepted delta/cycle, zero-delta streak, retry count, scope growth, cycles-to-done.

## Retry policy
Maximum 2 retries for the same blocking gap.

## Stop conditions
Zero-delta threshold reached; retry budget exhausted; unapproved scope growth; unsafe action needs human approval.

## Failure path
Invoke `failure-recovery.md`.

## Verification
Every completion claim is backed by an accepted criterion and evidence.

## Definition of Done
All required criteria accepted, tests pass, no blocking issue remains, and final gate returns `complete`.
