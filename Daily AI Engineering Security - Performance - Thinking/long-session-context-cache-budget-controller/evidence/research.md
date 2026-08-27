# Research — Long-Session Context Cache Budget Controller

## Topic
Pre-request token budgeting for long-running agent sessions with compaction and prompt-cache risk.

## Category
Token

## Problem
Agent runtimes often decide compaction from stale or incomplete usage signals and treat cache behavior separately from context-window budgeting. Large tool outputs, long idle periods, or repeated compaction can therefore cause overflow, expensive cache rewrites, and poor usable runway.

## Why it matters now
Multiple current reports across major coding-agent stacks show this is active in 2026 rather than theoretical.

## Affected users
Developers running long coding-agent sessions, multi-agent orchestration teams, platform builders, and users with tool-heavy repository workflows.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #32888**, opened 2026-07-13: auto-compaction can use stale server-reported token usage that does not include newly appended tool output, allowing the next sampling request to overflow the context window. https://github.com/openai/codex/issues/32888
2. **OpenAI Codex issue #35032**, opened 2026-07-23: automatic compaction in a long-running tool-heavy thread could complete while leaving the thread around 80% full, causing repeated compact/resume cycles and usage waste. https://github.com/openai/codex/issues/35032
3. **OpenAI Codex issue #40924**, opened 2026-08-26: large idle sessions may return after several hours with a very large context and expired prompt cache, making a small follow-up expensive; the issue proposes compaction before cache expiry. https://github.com/openai/codex/issues/40924
4. **Anthropic Claude Code issue #85326**, opened 2026-08-09: a roughly 950k-token session reportedly lost most prompt-cache reuse every ~40 seconds, forcing very large cache rewrites and substantial usage. https://github.com/anthropics/claude-code/issues/85326
5. **OpenAI engineering article, “Unrolling the Codex agent loop” (2026)** explains that Codex automatically calls `/responses/compact` after `auto_compact_limit` is exceeded, showing compaction is a primary context-window control. https://openai.com/index/unrolling-the-codex-agent-loop/

### Interpretation
The common engineering gap is **budgeting at the wrong boundary**. The next request should be planned using projected context—including pending tool/user/retrieval additions—and should account for cache state and required post-compaction runway, rather than using only previous model-reported usage.

## Existing approaches
Automatic threshold-based compaction; manual `/compact` or new-session workflows; prompt/prefix caching; summaries; tool-output truncation/filtering; reduced-context subagents.

## Remaining limitations
Last-response usage can omit newly appended tool output; a compaction can recover too little runway; cache expiry/cold prefixes can multiply cost; static thresholds ignore pending input size and uncertainty; aggressive summarization can lose correctness-critical context; cache telemetry differs by runtime.

## Root-cause analysis
1. Compaction checks happen after or independently from large context mutations.
2. Current usage and projected next-request usage are conflated.
3. Minimum safe runway is not an explicit invariant.
4. Cache lifecycle is not incorporated into continuation decisions.
5. Tool outputs and multi-agent inheritance can grow context nonlinearly.
6. Quality verification is often absent when context is compressed.

## Improvement opportunity
Add a runtime-neutral pre-request controller that computes projected utilization from current tokens plus pending user/tool/retrieval tokens, applies a safety margin, enforces minimum post-compaction runway, considers idle time and cache-read ratio, recommends `continue`, `checkpoint_or_compact`, or `new_session_with_checkpoint`, and never drops required context solely for token savings.

## Relevant sources
- https://github.com/openai/codex/issues/32888
- https://github.com/openai/codex/issues/35032
- https://github.com/openai/codex/issues/40924
- https://github.com/anthropics/claude-code/issues/85326
- https://openai.com/index/unrolling-the-codex-agent-loop/
