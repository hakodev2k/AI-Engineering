# Skill: Tool Progress Analysis

## Purpose
Determine whether repeated tool activity is making observable progress, without inspecting hidden chain-of-thought.

## Trigger
Repeated tool calls, repeated outcomes, rising tool-iteration count, or a task that stalls after an apparently successful tool call.

## Inputs
Event history, candidate tool call, tool class (`read` or `mutate`), success/failure status, normalized result summary, optional explicit state-change marker.

## Preconditions
Telemetry must preserve tool name, arguments, result status, and timestamps. Sensitive values must be redacted before persistence.

## Required context
Task goal, acceptance criteria, current observable state, recent tool events.

## Allowed tools
Read-only log inspection, deterministic fingerprinting, tests, metrics queries.

## Constraints
MUST NOT request hidden chain-of-thought. MUST NOT infer progress solely from a success exit code. MUST NOT auto-retry a blocked mutating action.

## Procedure
1. Normalize candidate call arguments deterministically.
2. Compare call fingerprint with recent calls.
3. Normalize recent outcomes and compare outcome fingerprints.
4. Check explicit progress evidence: changed file hash, changed record/version, new test state, new retrieved evidence, or other task-specific state transition.
5. Classify repetition as productive, uncertain, or no-progress.
6. For no-progress, require a changed hypothesis/action before another execution.
7. Escalate mutating repetitions at the stricter threshold.

## Decision points
- Productive new evidence: allow.
- Same call + same outcome without state change: recover/block according to threshold.
- Different call + same outcome repeatedly: recover when no-progress threshold is reached.
- Mutating replay without new precondition: block.

## Expected output
Facts, evidence references, normalized fingerprints, progress classification, decision, retry budget remaining, verification status.

## Metrics
No-progress streak, duplicate executions prevented, useful-call false positives, task completion after recovery, time/tokens avoided.

## Verification
Independent verifier replays fixture history through the guard and confirms deterministic decisions.

## Failure handling
Missing required telemetry yields `block` for mutating calls and `recover` for read-only calls; record the missing evidence.

## Stop conditions
Maximum two recoveries for the same no-progress outcome class. Then stop and require changed external evidence or human input.
