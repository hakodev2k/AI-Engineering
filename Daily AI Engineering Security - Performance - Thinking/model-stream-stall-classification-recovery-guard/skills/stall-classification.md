# Skill: Stall Classification

## Purpose
Determine whether a long model turn is slow/queued, transport-dead, retrying, or terminally stalled using observable evidence.

## Trigger
Warning threshold reached, no stream progress, or watchdog cancellation pending.

## Inputs
Trace events, request start, last stream chunk, retry state, transport error state, model/context/effort metadata, configured SLO.

## Preconditions
Clock timestamps are monotonic or normalized; request identity is stable; side-effect ledger is available before any retry.

## Allowed tools
Read-only logs/telemetry, provider status, local process inspection, `stall_trace_analyzer.py`.

## Constraints
Never infer health solely from elapsed time. Never replay a state-changing tool as a model-stream recovery action.

## Procedure
1. Capture baseline p95/p99 TTFT by comparable model/context/effort bucket.
2. Mark last deterministic progress event.
3. Separate pre-first-token from mid-stream silence.
4. If a transport error/reset exists, classify `transport_dead`.
5. If retry/backoff is active, classify `retry_active`; watchdog must not race the retry deadline.
6. If no explicit failure exists and elapsed time is within the historical tail, classify `slow_or_queued` and extend only to the bounded hard ceiling.
7. At the hard ceiling, preserve checkpoint and classify `timeout_ambiguous` rather than user cancellation.
8. Permit one model-request retry/resume only when the side-effect ledger proves no unsafe replay.
9. Re-measure latency and recovery cost.

## Decision points
Dead transport → retry once. Slow/queued → bounded wait. Ambiguous at hard ceiling → checkpoint then one safe resume or escalate. Repeated failure → stop.

## Expected output
Classification, evidence timestamps, chosen action, retry count, token/tool replay estimate.

## Verification
Compare analyzer classification against labeled incident traces and production terminal reasons.

## Failure handling / Stop conditions
Maximum one automatic recovery. Stop on unknown request identity, unsafe side-effect ambiguity, second failure, or hard ceiling.