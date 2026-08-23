# Workflow: Measure → Classify → Recover

## Trigger
A runtime has model-stream hangs, fixed-boundary aborts, or unexplained long TTFT.

## Goal
Reduce false aborts and dead-stream wait time without unsafe replay.

## Inputs
Representative traces, timeout policy, model metadata, side-effect ledger.

## Baseline
Record p50/p95/p99 TTFT, 600s/fixed-boundary aborts, dead-stream detection latency, manual recoveries, duplicated tokens/tools.

## Stages
1. **Observe** — collect at least one healthy-tail and one dead-stream incident.
2. **Measure** — run analyzer and establish model/context buckets.
3. **Diagnose** — identify timer-only decisions and missing signals.
4. **Hypothesize** — define phase-aware classification and bounded hard ceiling.
5. **Implement** — install pre-cancel gate; preserve request identity/checkpoint.
6. **Measure again** — replay labeled fixtures and canary production traces.
7. **Verify** — independent reviewer checks false-abort and dead-detection metrics.

## Checkpoints
Before policy change; before automatic retry; after canary; before rollout.

## Metrics
False-abort rate, dead-stream detection p95, recovery success, duplicate token/tool work, hard-ceiling breaches.

## Retry policy
One automatic recovery per incident. No recursive retry.

## Failure path
If recovery fails or safety evidence is incomplete, stop, preserve trace/checkpoint, and escalate.

## Definition of Done
Baseline and post-change measurements exist; both failure classes pass; no unsafe replay; reviewer approves.