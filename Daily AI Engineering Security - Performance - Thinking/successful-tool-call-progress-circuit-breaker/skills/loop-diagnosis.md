# Skill: Successful Tool-Call Loop Diagnosis

## Purpose
Determine whether repeated successful calls represent legitimate progress or deterministic waste.

## Trigger
Repeated calls, high tool/model-call counts, unexplained latency, or user interruption of a looping agent.

## Inputs
Tool trace, normalized arguments, results, timestamps, task goal, side-effect classification.

## Preconditions
At least one successful tool call and a reproducible trace.

## Required context
Task acceptance criteria, current external state, and tool idempotency metadata.

## Allowed tools
Read-only trace inspection, metrics queries, and `scripts/tool_progress_guard.py`.

## Constraints
MUST NOT infer that repetition is safe for mutating tools. MUST NOT suppress a call solely to reduce cost when correctness may depend on it.

## Procedure
1. Capture baseline calls/task, latency, tokens/task, and repeated-success rate.
2. Canonicalize arguments and group call fingerprints.
3. Compare results and explicit progress keys.
4. Classify tools as read-only, idempotent-with-key, or mutating.
5. Form a falsifiable hypothesis for repetition.
6. Run the guard against recorded candidates.
7. Integrate only if legitimate polling/verification fixtures still pass.
8. Re-measure the same workload.

## Decision points
Replay only read-only results. Block repeated mutating calls for review. Allow polling only when a progress key, interval, or terminal condition justifies it.

## Expected output
Facts, baseline, grouped repeats, hypothesis, gate decision, metrics, verification status.

## Metrics
Duplicate executions avoided, model steps avoided, task latency, completion rate, false-block rate.

## Verification
Independent verifier replays both stuck-loop and legitimate-repeat fixtures.

## Failure handling
If progress semantics are unknown, preserve safe behavior and escalate classification rather than guessing.

## Stop conditions
At most two hypothesis revisions. Stop on safety ambiguity or when measured evidence cannot reproduce the problem.
