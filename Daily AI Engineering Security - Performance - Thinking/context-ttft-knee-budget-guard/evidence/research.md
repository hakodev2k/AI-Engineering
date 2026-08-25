# Research — Context TTFT Knee Budget Guard

## Topic
Measured context-size budgets based on time-to-first-output latency knees rather than context-window capacity alone.

## Category
Token

## Problem
Long-running coding-agent threads can remain technically inside the model context window yet become operationally unusable because time-to-first-token/tool-call grows non-linearly. Capacity-based compaction thresholds therefore miss a performance failure mode: a thread can fit but take minutes before any useful action.

## Why it matters now
Fresh Codex reports quantify multi-minute TTFT in long threads and progressive slowdown that disappears in fresh threads. A separate current Codex observability request asks for stable per-model-request timing because token and turn-level telemetry is insufficient to diagnose these stalls reliably.

## Affected users
Long-running agent users, coding teams with persistent sessions, agent-platform builders, observability teams, and teams optimizing token cost/latency without sacrificing correctness.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #36458, opened 2026-08-01, reports 5–12 minute TTFT in a ~210k-token legacy thread. One traced turn had ~302 seconds before the first model-emitted tool call while the tool itself took ~0.16 seconds; across 13 completed turns, context size and TTFT had a reported Spearman correlation around 0.77: https://github.com/openai/codex/issues/36458
2. OpenAI Codex issue #30375 reports long conversations becoming progressively and non-linearly slower, with responsiveness returning immediately in a fresh conversation: https://github.com/openai/codex/issues/30375
3. OpenAI Codex issue #37460, opened 2026-08-07, requests stable per-model-request start/first-output/completion timing correlated with tokens and turn IDs for observability integrations: https://github.com/openai/codex/issues/37460

### Interpretation
These signals support a measurable latency-management problem, not a universal claim that token count alone causes TTFT. Cache state, images, provider load, reasoning mode, client orchestration, and session age can also change the curve. A useful control must therefore find the observed latency knee per workload/model instead of imposing one universal token number.

## Existing approaches
- Compact only near context-window limits.
- Start a fresh thread manually when responsiveness becomes poor.
- Use prompt caching or summaries.
- Monitor aggregate turn duration or token usage.
- Set static budgets as a fraction of context capacity.

## Remaining limitations
Capacity is not latency. Static fractions ignore model/workload differences. Manual resets are reactive. Aggregate turn duration includes tool and approval time. Cache hit rate can mask billed-token cost while TTFT remains poor. Teams lack a deterministic way to derive a latency budget from historical traces and enforce it before crossing the knee.

## Root-cause analysis
1. Context limits are treated as the primary boundary even though latency can degrade much earlier.
2. Turn-level metrics often fail to separate model wait from tool execution.
3. Compaction is triggered by capacity pressure rather than latency evidence.
4. Cache effectiveness, multimodal payloads, and model choice change the latency curve.
5. No workload-specific threshold is retained as an engineering contract.

## Improvement opportunity
Analyze per-request `(input_tokens, cached_input_tokens, ttft_ms, model, workload)` traces, bin by context size, detect the earliest sustained p95 TTFT breach, and produce a recommended soft token budget with safety margin. Enforce the budget pre-request while allowing explicit exceptions when correctness requires more context.

## Proposed solution
A JSONL trace analyzer, model/workload-aware knee detector, budget config, pre-request gate, bounded re-measurement workflow, token rules, and deterministic tests.

## Metrics
Input tokens/request; cached-token ratio; TTFT p50/p95 by token bin; recommended soft budget; requests above budget; p95 TTFT before/after; task quality/regression rate; cost/task where available.

## Trigger
Long-session slowdown, client/model upgrade, context strategy change, or periodic calibration using production-safe telemetry.

## Inputs
JSONL request telemetry with input tokens, cached input tokens, TTFT, model, and workload.

## Outputs
Per-group latency curve, detected knee, recommended soft budget, and gate decision.

## Relevant sources
- https://github.com/openai/codex/issues/36458
- https://github.com/openai/codex/issues/30375
- https://github.com/openai/codex/issues/37460
