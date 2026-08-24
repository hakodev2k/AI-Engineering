# Skill — Long-Thread TTFT Investigation

## Purpose
Identify whether long-tail agent latency originates in thread preparation/context size before model output rather than tools.

## Trigger
p95 TTFT breach, user-visible multi-minute pause, compaction failure, or rapid growth in persisted history.

## Inputs
Phase trace JSONL, thread byte/token snapshot, workload label, SLO.

## Preconditions
At least three representative turns or one reproducible severe incident.

## Allowed tools
Trace/log readers, local profiler, provider usage metadata, benchmark runner.

## Constraints
Do not delete required context. Do not infer root cause from total duration alone.

## Procedure
1. Capture baseline serialized history bytes and estimated tokens.
2. Record `request_start`, `model_first_token`, and `tool_start` timestamps.
3. Run `scripts/ttft_profiler.py` and group results by thread-size bucket.
4. If TTFT is high before any tool starts, classify pre-model/context path as primary suspect.
5. Inspect recent size jumps: images, tool outputs, duplicate context, compaction artifacts.
6. Form one optimization hypothesis: correctness-preserving compact, fork with explicit handoff summary/artifacts, externalize large tool output, or archive stale attachments.
7. Apply one change only.
8. Re-run the same workload class and compare p50/p95 TTFT and result-quality checks.
9. Repeat once if needed; otherwise stop and escalate.

## Decision points
Improved only when TTFT/SLO improves and required-context verification passes.

## Expected output
Before/after profile, root-cause evidence, chosen migration action, verification status.

## Metrics
p50/p95 TTFT, prepare time, size bucket, compaction time/failures, quality regression rate.

## Failure handling
After two unsuccessful migration attempts, retain traces and escalate rather than repeatedly compacting.

## Stop conditions
Verified SLO recovery or bounded escalation.
