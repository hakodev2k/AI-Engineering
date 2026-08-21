# Skill: Progress-Aware Liveness Diagnosis

## Purpose
Distinguish healthy slow work from genuine stalls and choose a bounded recovery path that preserves verified progress.

## Trigger
Run when a background agent, model stream, tool call, build/test phase, or orchestration loop approaches its watchdog threshold or enters retry.

## Inputs
Phase, elapsed/idle time, recent transport/tool events, checkpoint/artifact hashes, verification milestones, attempt number, token usage, previous failure signatures, and `config/watchdog-policy.json`.

## Preconditions
Instrumentation must report at least one observable liveness signal and a stable task/attempt identifier.

## Required context
Only operational evidence: timestamps, tool lifecycle, durable file/checkpoint changes, test/build state, retry signatures, and budgets.

## Allowed tools
Read-only trace/log access, repository diff/hash inspection, process/tool status, token usage metrics, and `scripts/liveness_guard.py`.

## Constraints
- MUST NOT disable all timeouts to avoid false positives.
- MUST NOT infer progress from repeated identical tool calls alone.
- MUST NOT restart from scratch when a verified resumable checkpoint exists.
- MUST NOT retry indefinitely.
- SHOULD use phase-specific patience rather than one global threshold.

## Procedure
1. Identify the current phase (`model_thinking`, `network_stream`, `tool_execution`, `build_or_test`, or `unknown`).
2. Capture the latest signal timestamps and durable progress marker.
3. Compare the current marker/hash with the last verified checkpoint.
4. Build a retry signature from failure class, phase, checkpoint hash, and last meaningful action.
5. Run the deterministic liveness guard.
6. Interpret decisions:
   - `continue`: at least one credible progress signal exists and hard budgets remain.
   - `wait`: no new strong signal yet but phase-specific patience has not expired.
   - `checkpoint_retry`: patience expired, but resumable progress exists and retry budget remains.
   - `stop`: hard timeout/token/retry/identical-signature budget exhausted.
7. On retry, persist checkpoint metadata and resume from it; compare the next attempt for new progress.
8. Stop if two identical no-progress signatures recur or configured budgets are exhausted.

## Decision points
Prefer durable progress (`checkpoint_advanced`, `verification_advanced`, `artifact_changed`) over transport chatter. Treat a tool in flight according to tool-phase patience. A transport event alone proves liveness, not useful task progress.

## Expected output
Decision, reason codes, next patience window, remaining budgets, current progress score, retry signature count, and checkpoint/resume recommendation.

## Metrics
False-positive kills, wasted tokens, genuine-stall detection time, checkpoint-resume rate, repeated-signature count, recovery success rate, and useful-progress/token ratio.

## Verification
Exercise healthy-slow, true-stall, active-tool, artifact-progress, hard-budget, and repeated-identical-failure fixtures.

## Failure handling
If liveness inputs are missing, fail safe to a bounded short wait followed by stop/escalation rather than an unbounded run or destructive restart.

## Stop conditions
Hard task timeout, total-attempt limit, wasted-token budget, repeated identical no-progress signature threshold, or inability to establish a safe resumable checkpoint.