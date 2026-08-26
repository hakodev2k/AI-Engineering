# Skill: Observable Progress Governance

## Purpose
Distinguish productive retries from zero-progress loops using observable events rather than hidden chain-of-thought.

## Trigger
Use for long-running tool agents, repeated-error incidents, unattended coding tasks, or before enabling autonomous retry loops.

## Inputs
Tool/result events, normalized arguments, result/error classes, durable artifact markers, test/evidence markers, turn/token/time budgets.

## Preconditions
The runtime exposes tool events and can stop scheduling future model turns.

## Required context
Only event traces, task acceptance criteria, and durable state identifiers. Hidden reasoning is neither required nor requested.

## Allowed tools
Structured tracing, `scripts/progress_loop_guard.py`, repository diff/test inspection, deterministic event replay.

## Constraints
- The runtime, not the model, MUST own the terminal transition.
- Activity MUST NOT be treated as proof of progress.
- A progress marker MUST represent externally observable new state or evidence.
- Legitimate transient retries SHOULD remain possible below the terminal threshold.
- Dangerous or irreversible actions still require existing approval controls.

## Procedure
1. Define durable progress markers for the task class (e.g., new patch hash, passing-test set, evidence ID, committed artifact).
2. Define result/error classes and volatile argument fields.
3. Establish baseline turn/token/time distribution for successful runs.
4. Replay known transient failures and known zero-progress loops.
5. Configure warning and terminal equivalent-failure thresholds.
6. Integrate the guard after each tool result, before the next model turn.
7. On terminal threshold, checkpoint useful state and transfer to an external terminal status.
8. Independently verify false-stop and runaway-tail metrics.

## Decision points
- New durable progress → continue and retain updated markers.
- Repeated equivalent failure below terminal threshold → continue with warning evidence.
- Terminal equivalent-failure threshold or hard budget → checkpoint and stop.
- Missing required event data → fail closed to terminal review rather than uncontrolled retry.

## Expected output
Observable Facts, Progress Markers, Equivalent-Failure Count, Budget State, Decision, Verification status.

## Metrics
Zero-progress turns before stop, tokens/time after first repeat, false-stop rate, completion rate, p95 cost/completed task.

## Verification
A separate verifier replays both transient-success and runaway-loop fixtures.

## Failure handling
Persist a bounded trace, checkpoint durable artifacts, stop scheduling new turns, and escalate ambiguous task-state recovery.

## Stop conditions
No more than two threshold-tuning iterations per benchmark set. Never remove the terminal owner merely to reduce false positives.
