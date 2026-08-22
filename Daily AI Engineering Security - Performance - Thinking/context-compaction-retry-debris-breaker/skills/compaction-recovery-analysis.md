# Skill — Compaction Recovery Analysis

## Purpose
Diagnose context-compaction failures without feeding failure debris back into the next compaction attempt.

## Trigger
A normal model call overflows context, a compaction request fails, a prior summary appears to disappear, or compaction repeatedly produces equivalent payloads.

## Inputs
Session items with metadata, provider context limit, prior verified summary, retry attempts, current policy.

## Preconditions
The original session history and prior summary are read-only inputs. No session deletion is allowed.

## Allowed tools
Session export/read, token or character estimator, deterministic scripts in this package, diff tools.

## Constraints
Do not request hidden chain-of-thought. Do not remove user constraints, accepted decisions, completed work, unresolved blockers, or security boundaries merely to save tokens.

## Procedure
1. Snapshot the current semantic history and retry/debug records separately.
2. Measure total input size and size by message kind.
3. Identify debris kinds excluded by policy and calculate the cleaned payload.
4. Compare the current prior summary with raw evidence for active goal, completed work, unresolved work, constraints, and critical facts.
5. Build a bounded candidate payload using prior verified summary + recent semantic tail.
6. Require either >=10% size reduction or a changed recovery strategy before retry.
7. Run the deterministic gate and record the decision.
8. After a successful summary, run continuity verification before replacing the prior summary.

## Decision points
- If cleaned payload still exceeds the budget, reduce the semantic tail; do not re-add excluded diagnostics.
- If continuity cannot be proven, preserve the prior verified summary and escalate.
- If retry budget is exhausted, stop instead of looping.

## Expected output
Baseline sizes, excluded artifacts, candidate payload size, continuity status, retry decision, evidence references.

## Metrics
Payload-size delta, excluded-debris bytes, retry count, continuity-field coverage, recovery latency.

## Verification
A fixture with durable retry debris terminates or recovers within bounded attempts; a fixture with a valid old handoff does not silently replace it with a thinner summary.

## Failure handling
Keep the last verified summary, preserve raw session data, emit a blocking diagnostic, and require human action for destructive recovery.

## Stop conditions
Success after verified compaction; retry budget exhausted; candidate cannot fit safely; continuity verification fails twice.
