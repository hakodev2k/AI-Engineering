# Skill: Context Remeter Analysis

## Purpose
Measure token amplification caused by model-visible control polling, repeated tool outputs, and long-context orchestration before optimizing it.

## Trigger
Unexpected token/cost growth, long-running multi-agent tasks, repeated waits/status calls, or cache-read spikes.

## Inputs
JSONL trace with event type, input tokens, cached tokens, latency, control result, agent ID and optional tool-output hash.

## Preconditions
Use comparable workloads and preserve task-success evidence.

## Required context
Only orchestration events, usage counters and output identities; raw tool output is unnecessary when a hash is available.

## Allowed tools
Trace export, `scripts/remeter_profiler.py`, local statistics, read-only runtime inspection.

## Constraints
MUST establish a baseline. MUST NOT remove correctness-critical context. MUST NOT infer savings from cache hit rate alone.

## Procedure
1. Capture one representative baseline task end-to-end.
2. Profile wait-family turns, no-change results, token totals, cache-read ratio and duplicate outputs.
3. Identify whether no-op control events trigger model inference.
4. Test whether stale agent state sustains polling after useful work ends.
5. Test whether compaction/reconstruction loses deduplication identity.
6. Form one measurable hypothesis, e.g. “backoff after two no-change polls reduces model-visible waits by 60% without delaying task completion by >5%.”
7. Apply one policy change.
8. Re-run the same workload and compare tokens/task, latency and success.
9. Repeat at most twice.

## Decision points
Optimize only when a measurable control-turn or duplicate-output amplification exists. Reject an optimization if task success regresses or required state changes are missed.

## Expected output
Baseline, Facts, Evidence, Hypothesis, Before/After metrics, Risks, Decision, Verification status.

## Metrics
Tokens/task, cached tokens/task, wait-turn ratio, no-change cached tokens, duplicate outputs, tokens/useful state change, p50/p95 latency, task success.

## Verification
Independent verifier checks equivalent workload and no critical context loss.

## Failure handling
Maximum 2 optimization retries. Fallback to conservative polling. Escalate missed-state or irreversible-work ambiguity.

## Stop conditions
Stop on task-quality regression, missing lifecycle evidence, or two failed iterations.
