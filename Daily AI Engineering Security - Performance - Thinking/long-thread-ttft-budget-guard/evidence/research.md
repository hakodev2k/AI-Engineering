# Research — Long-Thread TTFT Budget Guard

## Topic
Pre-model time-to-first-token degradation in oversized long-running agent threads.

## Category
Performance

## Problem
Long-running coding/agent threads can accumulate enough persisted history, images, tool output, reasoning state, and compaction artifacts that the next trivial turn spends minutes in pre-model/context preparation before any tool I/O. Operators frequently attribute the symptom to model slowness because they lack phase-level measurements and a preflight budget for thread size.

## Why it matters now
Recent Codex reports show severe long-thread behavior: issue #36458 (2026-08-01) reports 5–12 minute TTFT in a roughly 210k-token legacy thread before tool I/O; issue #38861 (2026-08-16) records a remote-compaction request body of about 43.8 MB uncompressed / 32.3 MB zstd followed by failed compaction and a stuck reconnecting state. OpenAI's current Realtime API guidance also explicitly describes truncation/retention controls as a way to reduce repeated truncation and improve cache behavior, supporting proactive context-size governance rather than waiting for hard limits.

## Affected users
Developers with months-long coding threads, agent-platform operators, desktop/CLI integrations, multimodal agent users, and teams debugging intermittent long-tail latency.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #36458, opened 2026-08-01: a ~210k-token legacy desktop thread shows 5–12 minute TTFT before tool I/O. https://github.com/openai/codex/issues/36458
2. OpenAI Codex issue #38861, opened 2026-08-16: a long-running image-generation thread entered remote compaction with a 43,810,885-byte request body, compaction failed, yet UI reported compaction and became stuck reconnecting. https://github.com/openai/codex/issues/38861
3. OpenAI Realtime documentation describes retention-ratio truncation to reduce truncation frequency and improve cached-token reuse. https://platform.openai.com/docs/api-reference/realtime-server-events/conversation/item/done

### Interpretation
Thread size and preparation work are first-class latency dimensions. A host needs phase timing plus size budgets to decide when a thread should be compacted, forked, archived, or denied additional large payloads before latency becomes pathological.

## Existing approaches
- Automatic provider/host compaction.
- Context-window limits and truncation.
- Prompt caching.
- Manual creation of a new thread when the old one feels slow.
- Generic latency metrics that measure only total turn duration.

## Remaining limitations
- Total latency does not reveal whether time is spent before the model, inside the model, or after tools.
- Automatic compaction may itself become expensive or fail on huge persisted rollouts.
- Hard context-window limits trigger too late for user-experience SLOs.
- Thread migration is usually reactive and subjective rather than tied to measured budgets.
- Multimodal bytes and serialized tool artifacts can be large even when rough text-token counts look acceptable.

## Root-cause analysis
1. Persisted thread growth is not governed by a latency SLO.
2. Hosts lack consistent measurements for request serialization bytes, effective tokens, prepare duration, TTFT, and first-tool timestamp.
3. Compaction is treated as correctness/window management rather than a potentially expensive operation with its own budget.
4. Large binary/multimodal or tool artifacts distort text-only size heuristics.
5. Operators lack a deterministic migration threshold backed by benchmark evidence.

## Improvement opportunity
Instrument every long thread with phase timestamps and serialized-size metrics. Benchmark TTFT against thread size, derive environment-specific warning/block thresholds, and require fork/compact/archive decisions before a thread exceeds a measured latency budget.

## Goal
Keep p95 TTFT within an explicit SLO while preserving task correctness and required context.

## Metrics
`history_bytes`, `estimated_input_tokens`, `prepare_ms`, `ttft_ms`, `first_tool_ms`, `compaction_ms`, `compaction_failures`, p50/p95 TTFT by size bucket, and migration success rate.

## Trigger
Before sending a turn on a long-running thread, after adding large tool/image payloads, after compaction failure, or when TTFT exceeds the SLO twice.

## Inputs
JSONL phase trace, thread-size snapshot, configured warning/block budgets.

## Outputs
Measured profile, PASS/WARN/BLOCK decision, size bucket, and recommended next action.

## Proposed solution
A deterministic profiler and budget gate plus a bounded measure-diagnose-migrate-verify workflow. The gate does not delete context automatically; it recommends or blocks additional growth until the host chooses a correctness-preserving compaction/fork/archive strategy.

## Verification
Verified only when baseline and post-migration traces show lower p95 TTFT or smaller preparation cost without loss of required task context, and regression tests prove the profiler distinguishes pre-model delay from tool latency.
