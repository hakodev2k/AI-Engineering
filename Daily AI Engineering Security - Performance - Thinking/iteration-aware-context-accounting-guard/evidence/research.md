# Research

## Topic
Iteration-aware and reasoning-aware context accounting for agent runtimes

## Category
Token

## Problem
Usage telemetry can represent cumulative work across internal iterations while context-window occupancy represents only the final model-visible request state. Runtimes that sum both, or re-add reasoning already included by the server, can trigger premature compaction and waste tokens, latency, cache reuse, and engineering state.

## Why it matters now
Modern agent turns can contain advisor/model subcalls, cached prefixes, persisted reasoning, subagents, transport-specific usage signals, and provider-specific context semantics. GPT-5.6 and multi-iteration Claude Code reports in August 2026 expose concrete accounting mismatches at large context sizes.

## Affected users
Long-running coding-agent users, multi-agent orchestrators, agent SDK/platform teams, users of mixed providers/gateways, and teams optimizing token cost/latency.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39767, opened 2026-08-20, reconstructs a GPT-5.6 `all_turns` rollout and reports historical reasoning being added locally even though server `input_tokens` already included it. Across 76 automatic compactions, the double-counting branch crossed the limit 76/76 times while the inclusion-aware branch crossed 0/76. A concrete example compacted at apparent 247,433 tokens while reconstructed occupancy was 214,062 in a 272K effective window. https://github.com/openai/codex/issues/39767
2. Anthropic Claude Code issue #84738, opened 2026-08-07, reports top-level usage after an advisor call summing two message iterations that each carry the full context. A real ~516K context became ~1.03M apparent input and triggered compaction hundreds of thousands of tokens early; the report quantified repeated cases across ~1,000 transcript files. https://github.com/anthropics/claude-code/issues/84738
3. Anthropic Claude Code issue #88107, opened 2026-08-20, reports custom-provider subagent results with empty per-call usage while native Claude subagents expose detailed usage including `iterations[]`. This shows downstream accounting cannot assume one stable telemetry shape across providers. https://github.com/anthropics/claude-code/issues/88107
4. OpenAI Codex issue #37448, opened 2026-08-07, argues that compaction decisions must consider prompt-cache economics and warns that minimizing active token count can be counterproductive when rewriting the prefix destroys cache reuse. https://github.com/openai/codex/issues/37448

## Interpretation
These are independent runtime/provider signals, not evidence of one shared bug. They demonstrate a common design weakness: one scalar `token usage` value is being asked to represent billing work, context occupancy, cache behavior, and compaction eligibility even though those quantities differ.

## Existing approaches
Provider-reported usage, client-side token estimates, context-window thresholds, prompt caching, and compaction based on last-turn token totals.

## Remaining limitations
Top-level usage may be cumulative across iterations; inclusion flags may be missing or transport-dependent; historical reasoning may already be counted; custom providers may omit detail; and compaction thresholds often lack provenance/confidence metadata.

## Root-cause analysis
1. Conflating cumulative billing usage with final-state context occupancy.
2. Additive local estimates without a reliable server inclusion contract.
3. Transport/header-dependent reasoning semantics.
4. Provider/model switches without versioned accounting rules.
5. Downstream consumers reading a top-level scalar when detailed iterations exist.

## Improvement opportunity
Normalize telemetry into separate fields: `billing_input`, `final_context_input`, `local_unreported_additions`, `cache_read`, `reasoning_inclusion_status`, and `confidence`. Prefer the last model-message iteration for context occupancy; add local reasoning only with explicit omission evidence; compare apparent and effective compaction decisions before changing runtime behavior.

## Goal
Lower premature compactions, token/cost waste, and summary churn without allowing genuine context overflow or dropping required context.

## Metrics
Apparent/effective input ratio; premature-compaction count; compactions/task; tokens/task; cost/task; cache hit rate; latency; context utilization; result-quality regression; context-loss incidents.

## Trigger
Before auto-compaction logic changes, after model/provider/transport upgrades, when context meters jump unexpectedly, or when subagents compact far below expected occupancy.

## Inputs
Raw usage events, model/window size, compaction threshold, iteration details, local reasoning estimates, provider inclusion metadata.

## Outputs
Normalized accounting records, inflation evidence, decision replay, confidence, pass/block status.

## Relevant sources
- https://github.com/openai/codex/issues/39767
- https://github.com/anthropics/claude-code/issues/84738
- https://github.com/anthropics/claude-code/issues/88107
- https://github.com/openai/codex/issues/37448
