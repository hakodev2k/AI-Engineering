# Workflow: Diagnose and Recover

**Trigger:** repeated call/outcome signal or rising no-progress streak.  
**Goal:** stop unproductive loops while preserving productive long-running work.

## Inputs
Task goal, acceptance criteria, event history, candidate call, tool consequence class.

## Baseline
Capture calls/task, tool latency, repeated fingerprints, token use, and completion rate from representative traces.

## Stages
1. **Observe:** collect recent calls, outcomes, state-change evidence.
2. **Measure baseline:** compute repetition and no-progress streak.
3. **Diagnose:** distinguish exact-call, same-outcome, varying-argument, runtime-replay, and productive repetition.
4. **Form hypothesis:** state one observable reason the next call should create new evidence.
5. **Implement improvement:** change plan/tool/arguments or stop the unsafe replay.
6. **Measure again:** compare fingerprints and state evidence.
7. **Improved?** If no, permit at most one additional changed recovery attempt; if yes, continue.
8. **Verify:** independent agent checks the final trace.

## Checkpoints
Before any repeated mutating call; after each recovery; before completion.

## Metrics
No-progress streak, duplicate calls prevented, completion rate after recovery, latency/tokens avoided, false-positive blocks.

## Retry policy
Maximum 2 recovery attempts for the same no-progress class.

## Stop conditions
Block immediately on unapproved mutating replay. Stop after retry budget exhaustion or missing critical telemetry.

## Failure path
Return a structured halt containing last successful state, repeated evidence, attempted recoveries, and required next evidence.

## Verification
Run unit fixtures and replay at least one representative production trace with secrets removed.

## Definition of Done
Baseline exists; guard integrated; before/after metrics captured; recovery is bounded; tests pass; independent verification passes.
