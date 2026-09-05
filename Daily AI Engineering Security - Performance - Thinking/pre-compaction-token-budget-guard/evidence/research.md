# Research evidence

## Topic
Pre-Compaction Token Budget Guard

## Category
Token

## Problem
Agent context compaction can trigger prematurely because token-budget logic uses the wrong quantity or relies on model-context metadata that is not reliably normalized.

## Why it matters now
Long-horizon coding agents increasingly depend on automatic context management. Current public issues show both a concrete arithmetic bug and ongoing model-metadata/configuration problems around context-window sizing.

## Affected users
Coding-agent users; framework maintainers; teams running long-lived agents; platform builders routing across models/providers.

## Current public evidence
### Observed evidence
1. OpenHands issue #13471, opened 2026-08-28, reports a regression in compaction logic after a context-window PR: the threshold comparison used `max_input_tokens` as though it represented tokens already used, causing compaction around 40-50k tokens on a 400k-token model rather than near the intended 80% threshold. The issue includes a proposed fix to compare `input_token_count` against the threshold.
2. OpenHands issue #13291, opened 2026-08-18, reports incorrect context-window size for GPT-5.2-Codex in LiteLLM/OpenHands, with 272k shown instead of the documented 400k, causing premature context limits; manual model configuration is described as a workaround.
3. OpenHands documentation describes automatic compaction when context becomes too large and exposes configuration such as `enable_history_truncation`, confirming compaction is a first-class mechanism whose trigger affects runtime behavior.

### Interpretation
Automatic compaction is useful, but its safety depends on two independent facts: accurate model capacity and correct accounting of used versus remaining tokens. A bug in either can create unnecessary summarization, latency, token cost, and information loss.

### Proposed solution
Introduce a provider-neutral canonical budget calculator, deterministic threshold hook, boundary regression tests, and before/after measurement of utilization, cost, latency, and task quality.

## Existing approaches
Framework-specific context thresholds; manual `model_context_window` overrides; summarization/compaction; history truncation; provider metadata; prompt caching.

## Remaining limitations
Metadata can lag new model releases. Different providers report usage differently. Threshold code can silently swap used/remaining quantities. A successful summarization call does not prove that compaction was necessary or correctly timed.

## Root-cause analysis
- Ambiguous variable semantics for used vs remaining tokens.
- Provider/model context-window metadata drift.
- Missing invariant and boundary tests around compaction thresholds.
- Observability focuses on context-limit failures, not utilization at compaction.
- Multi-provider adapters normalize model names and token fields inconsistently.

## Improvement opportunity
Make the compaction decision deterministic and auditable, then measure the actual trigger utilization on representative traces. Separate capacity discovery from token usage and require tests at threshold-1, threshold, and capacity boundaries.

## Relevant sources
- https://github.com/OpenHands/OpenHands/issues/13471
- https://github.com/OpenHands/OpenHands/issues/13291
- https://docs.openhands.dev/openhands/usage/runtimes/context-management
- https://docs.litellm.ai/docs/completion/token_usage
