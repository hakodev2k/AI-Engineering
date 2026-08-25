# Skill: Diagnose Silent Agent Stalls

## Purpose
Classify long `Thinking` turns using observable event/usage evidence before changing timeouts or retry logic.

## Trigger
A turn exceeds the expected visible-progress gap or a user reports no output/tool activity.

## Inputs
JSONL event trace, model/adapter identity, workload ID, known-good threshold data.

## Preconditions
Comparable clocks; cumulative per-turn usage counters; sensitive payload bodies removed.

## Required context
Event kinds, timing, terminal state, cumulative token usage, adapter/model version, and whether a side-effecting tool may be active.

## Allowed tools
Telemetry readers, `scripts/stall_watchdog.py`, benchmark runner, non-mutating log queries.

## Constraints
Do not request chain-of-thought. Do not infer backend failure from a blank reasoning panel alone. Do not blindly retry irreversible tools.

## Procedure
1. Capture a known-good baseline for the same workload class.
2. Validate trace ordering and token monotonicity.
3. Compute last event, last visible progress, token delta during silence, and terminal evidence.
4. Classify as healthy/terminal, `silent_token_burn`, or `event_stream_stall`.
5. Form one root-cause hypothesis tied to model budget, stream/reconnect, UI projection, or orchestration.
6. Change one mechanism only.
7. Re-run the identical workload up to two times.
8. Compare metrics and request independent verification.

## Decision points
Tokens increasing above budget with no visible action -> silent-token-burn. No event beyond event-silence threshold -> stream-stall. Reasoning usage with normal terminal/text/tool events -> observability issue, not stall.

## Expected output
Classification, evidence timestamps, token delta, hypothesis, intervention, before/after metrics, verification status.

## Metrics
Visible-progress gap, silent token delta, recovery time, false-cancel rate.

## Verification
Independent verifier reruns the script on normalized events and confirms thresholds match baseline.

## Failure handling
Invalid evidence stops diagnosis. Preserve trace and escalate rather than guessing.

## Stop conditions
Terminal event; verified recovery; two failed retries; invalid evidence; unresolved possible side effect.
