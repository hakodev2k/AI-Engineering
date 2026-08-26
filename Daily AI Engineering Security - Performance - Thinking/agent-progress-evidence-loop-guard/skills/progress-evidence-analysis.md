# Skill: Progress Evidence Analysis

## Purpose
Determine whether a long-running agent is making verifiable task progress rather than merely remaining active.

## Trigger
Repeated tool calls, rising token usage without artifact changes, a long-running agent near its budget, or any runtime stop/recovery investigation.

## Inputs
Agent trace JSONL, task acceptance criteria, durable artifact hashes, workspace hashes, verification results, external-state snapshots, and configured budgets.

## Preconditions
Trace timestamps and tool-call/result records are available. Progress fields must be observable without hidden chain-of-thought.

## Required context
Task goal, measurable completion criteria, tool results, artifact/state fingerprints, and prior checkpoints.

## Allowed tools
Trace readers, hashing utilities, repository diff tools, test runners, and `scripts/progress_guard.py`.

## Constraints
- MUST NOT infer progress from token generation or model liveness alone.
- MUST NOT request hidden chain-of-thought.
- MUST preserve any context required to verify correctness.
- MUST use bounded retries.

## Procedure
1. Record Facts: current task, active tools, budget, last verified checkpoint.
2. Record Evidence: action signatures, result fingerprints, workspace/artifact fingerprints, tests or external-state changes.
3. Run the deterministic progress guard.
4. Classify each repeated action as productive polling, productive iteration, or no-progress repetition.
5. Form at most two hypotheses for the no-progress cause.
6. Choose one recovery action that changes evidence acquisition, tool choice, or task decomposition.
7. Re-run once after each recovery attempt.
8. Stop when progress resumes, completion is verified, the no-progress threshold is reached, or two recovery attempts fail.

## Decision points
A repeated call is not a failure when its result or relevant external state changes. Repetition with unchanged canonical action and unchanged evidence is a no-progress signal.

## Expected output
`Facts`, `Evidence`, `Assumptions`, `Hypotheses`, `Decision`, `Risks`, and `Verification status`, plus the guard JSON result.

## Metrics
No-progress steps before stop, tokens spent after last durable progress, recovery success rate, false-positive stops on legitimate polling, and verified completion rate.

## Verification
An independent verifier confirms that the stop/recovery decision is supported by observable state and that saved partial work is durable.

## Failure handling
If evidence fields are missing, fail safe by escalating to a hard budget rather than claiming no-progress. Maximum recovery attempts: 2.

## Stop conditions
Verified completion; deterministic no-progress stop; hard budget reached; or exhausted recovery attempts.
