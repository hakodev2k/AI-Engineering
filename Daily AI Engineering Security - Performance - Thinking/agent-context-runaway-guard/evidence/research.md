# Research: Agent Context Runaway Guard

## Topic
Prevent repeated compaction and token/context amplification in long-running coding-agent sessions, especially when large tool/image payloads survive compaction.

## Category
Token

## Problem
Long-running agents can compact history yet remain near the context threshold because high-cost payloads are retained or repeatedly copied. Small follow-up turns then trigger another compaction, increasing latency, token usage, storage, and risk of summary drift instead of restoring healthy context headroom.

## Why it matters now
Current Codex issue reports from July 2026 show the failure on modern compaction paths and large multimodal sessions. The issue is measurable in tokens, bytes, compaction frequency, and post-compaction headroom.

## Affected users
Developers using long-lived coding agents, multimodal debugging sessions, platform builders implementing compaction/memory, and teams paying for repeated context processing.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #33493 reports local compaction v2 retaining unbounded `input_image` payloads. One affected thread was approximately 4.16 GB with 224 compaction records, 92 images retained in the latest replacement history, about 26.47 million inline image/base64 characters, and only about 8k tokens of headroom after compaction. Short follow-ups could immediately trigger compaction again.
   Source: https://github.com/openai/codex/issues/33493
2. The same report links earlier independent failure modes: #24388 retained `input_image` history, #24550 large inline images in replacement history causing Responses WebSocket fallback, #24676 image-heavy rollout growth/hangs, and #9601 context-estimation problems after history mutation.
3. Codex issue #22486 describes repeated compactions as a recurring long-session cost/latency/reliability problem and requests separate compaction model control, showing that compaction itself is a significant operational phase rather than a rare edge case.
   Source: https://github.com/openai/codex/issues/22486
4. Codex issue #24850 distinguishes visible post-tool `Thinking` intervals caused by compaction from hung model requests, demonstrating that compaction latency also needs explicit observability rather than being conflated with reasoning.
   Source: https://github.com/openai/codex/issues/24850

## Interpretation
Compaction is not successful merely because a summary was produced. It must create enough durable headroom for subsequent work. If retained payloads are costed incorrectly, especially images/base64/tool outputs, compaction can become a feedback loop: threshold → compact → retain expensive history → tiny headroom → next turn → threshold again.

## Existing approaches
- Automatic context compaction near a model threshold.
- Text-token budgets for retained messages.
- Summaries/replacement history.
- Manual `/compact` or new-session resets.
- Model/provider prompt caching.

## Remaining limitations
- Text-only estimators can treat images or opaque payloads as near-zero cost.
- A single threshold without hysteresis allows immediate re-triggering.
- Retained payloads may be duplicated in persistent history.
- Compaction success may not be checked against a minimum post-compaction headroom target.
- Tool outputs can contain large low-value logs or encoded blobs.
- Manual resets discard useful state and do not fix the underlying budgeting error.

## Root-cause analysis
1. Budgeting the wrong unit: text tokens while ignoring bytes/image cost/tool payload cost.
2. No per-type caps for images, tool output, history, or summaries.
3. No hysteresis between compaction trigger and desired post-compaction size.
4. Retention based on recency without utility/cost constraints.
5. Re-copying large inline payloads rather than referencing content-addressed artifacts.
6. Missing post-compaction verification and bounded-loop stop conditions.

## Improvement opportunity
Add a deterministic context profiler and budget gate that measures text, images/data URLs, tool output, duplicate payloads, and headroom. Require compaction to hit a target utilization below the trigger threshold, cap expensive payload types, and stop repeated compaction when the same retained payload dominates successive attempts.

## Goal
Reduce tokens/task, compactions/task, payload bytes, and latency while preserving required task facts and verification state.

## Metrics
- Context utilization before/after compaction.
- Post-compaction headroom tokens.
- Compactions per 10 turns.
- Total text chars, data-URL/base64 chars, tool-output chars, duplicate chars.
- Estimated tokens/task and bytes persisted/task.
- Quality regression rate on required facts/checkpoints.

## Trigger
Context utilization >= configured trigger, compaction more than once within N turns, rollout/session file growth, or large image/tool payload ingestion.

## Inputs
JSON/JSONL context export, context-window size, trigger ratio, target ratio, per-type budgets, required-facts list.

## Outputs
Profile JSON, blocking/non-blocking budget findings, recommended eviction/compression targets, before/after comparison.

## Relevant sources
- https://github.com/openai/codex/issues/33493
- https://github.com/openai/codex/issues/22486
- https://github.com/openai/codex/issues/24850
- https://github.com/openai/codex/issues/24388
- https://github.com/openai/codex/issues/24550
- https://github.com/openai/codex/issues/24676
- https://github.com/openai/codex/issues/9601
