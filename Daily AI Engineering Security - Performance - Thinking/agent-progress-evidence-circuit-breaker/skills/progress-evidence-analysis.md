# Skill: Progress Evidence Analysis

## Purpose
Determine whether an agent run has made externally observable progress without using or requesting hidden chain-of-thought.

## Trigger
Before automatic continuation, after a retry window, or when token/time spend increases without clear artifact or evidence changes.

## Inputs
Event ledger, task state, artifact hashes, test outcomes, tool-call/result hashes, evidence identifiers, optional token usage.

## Preconditions
A finite policy exists and event timestamps/order are available.

## Required context
Only task requirements and observable execution state. Internal reasoning text is neither required nor accepted as proof of progress.

## Allowed tools
Read-only event/log inspection, hashing, test runners, repository diff/status commands, deterministic progress guard.

## Constraints
- Commentary or intention statements MUST NOT count as progress.
- A repeated tool call MUST NOT reset the no-progress budget unless its result is materially different and evidence-backed.
- Paused, blocked, cancelled, or completed state MUST block automatic continuation.
- Retry limits MUST remain bounded.

## Procedure
1. Capture baseline task state and artifact/evidence digests.
2. Normalize tool calls and results into stable hashes.
3. Mark accepted progress events only when externally observable state changed.
4. Count consecutive no-progress windows.
5. Count identical consecutive tool calls.
6. Run `scripts/progress_guard.py`.
7. If blocked, preserve the ledger and classify cause: stale task state, duplicate action, unchanged result, or missing evidence.
8. Permit recovery at most as allowed by policy; require a changed hypothesis/action, not the same call.
9. Before completion, hand off to `subagents/progress-verifier.md`.

## Decision points
- `continue`: progress exists or bounded budget remains.
- `stop`: terminal state, repeated-call threshold, or no-progress threshold reached.
- `escalate`: evidence is contradictory or required state cannot be read safely.

## Expected output
A machine-readable decision and a short evidence ledger containing Facts, Evidence, Decision, Risks, and Verification status.

## Metrics
No-progress turns/task, duplicate-call stop latency, tokens/progress event, false-stop rate, continuation-after-terminal-state count.

## Verification
Replay known stuck and productive fixtures. Productive fixtures must continue; stuck fixtures must stop within configured bounds.

## Failure handling
Fail closed on malformed event records when policy requires it. Never hide failure by increasing thresholds during the same run.

## Stop conditions
Stop immediately on terminal task state. Otherwise stop after configured no-progress or identical-call limits; no infinite retries.
