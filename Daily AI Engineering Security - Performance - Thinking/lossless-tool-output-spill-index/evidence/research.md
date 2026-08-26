# Research — Lossless Tool Output Spill Index

**Topic:** Lossless preservation and retrieval of oversized agent tool outputs  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent runtimes often reduce oversized tool output with truncation, compaction, or spill-to-file mechanisms. Current implementations show failure modes where data is silently destroyed, spill files are not practically pageable, or the full output is repeatedly resent and overflows context.

## Why it matters now
Several public reports from June–August 2026 show the same engineering failure across different agent stacks: size controls are necessary, but independently designed truncation, persistence, and retrieval layers can violate each other’s assumptions. The result is token blow-ups at one extreme and silent evidence loss at the other.

## Affected users
Coding-agent users, agent framework maintainers, platform engineers, RAG/tool builders, and teams with large shell/search/API outputs.

## Current public evidence

### Observed evidence
1. Cloudflare Agents issue #2014, opened August 2, 2026, reports unconditional `truncateOlderMessages` behavior with default `maxToolOutputChars: 500`, silently replacing contents of oversized structured outputs: https://github.com/cloudflare/agents/issues/2014
2. Hermes Agent issue #79818, opened August 6, 2026, reports persisted tool output written as one escaped JSON line while the agent is instructed to page with line-based `offset`/`limit`, making paging ineffective: https://github.com/NousResearch/hermes-agent/issues/79818
3. Hermes Agent issue #86401, opened August 14, 2026, reports terminal output capped at 50K before a persistence layer whose threshold is 100K, so overflow is destroyed before it can be saved: https://github.com/NousResearch/hermes-agent/issues/86401
4. Agenta issue #5341, opened July 16, 2026, reports a Composio tool result of roughly 241k tokens being inserted raw into context and resent on later calls, causing context/rate failures: https://github.com/Agenta-AI/agenta/issues/5341
5. Zed issue #59401, opened June 16, 2026, reports large `grep`/`read_file` outputs sent without truncation and overflowing model context: https://github.com/zed-industries/zed/issues/59401
6. Cloudflare Agents documentation, updated in 2026, describes micro-compaction and row-size protection for large tool outputs, including summaries/previews and re-running tools when content is compacted: https://developers.cloudflare.com/agents/concepts/conversation-state-and-memory/

### Interpretation
The problem is not simply “truncate less” or “increase the context window.” The recurring defect is ordering and contract mismatch: destructive reduction can happen before durable preservation, persistence formats can be incompatible with retrieval primitives, and previews can become the only evidence available to later reasoning.

## Existing approaches
- Hard per-tool byte/character caps.
- Message-level micro-compaction.
- Summarization of old tool results.
- Spill large outputs to files.
- Re-run the tool when more detail is needed.
- Provider context-window limits and conversation compaction.

## Remaining limitations
- Re-running may be expensive, slow, non-deterministic, or impossible after external state changes.
- A persisted object is useless if the model cannot address stable chunks/ranges.
- Independent thresholds can create dead zones where content is already destroyed before spill logic runs.
- Character caps can split UTF-8 or structured data badly if implemented naively.
- A compact preview can omit the exact line/value needed for verification.
- Raw inclusion solves evidence preservation but creates recurring token/latency cost on every subsequent call.

## Root-cause analysis
1. No single invariant states that preservation MUST precede reduction.
2. Storage and context-budget layers are calibrated independently.
3. Retrieval interfaces are designed after serialization rather than together with it.
4. Tool-output provenance/digest is often absent, so a later range cannot be proven to belong to the original result.
5. Metrics focus on context size, not evidence-recovery rate or re-run cost.

## Improvement opportunity
Adopt a spill-first, content-addressed envelope: compute a digest, preserve exact bytes, generate only a bounded UTF-8-safe preview for model context, expose deterministic byte-range reads, and validate every range against the stored digest. Configure the spill threshold below every destructive upstream cap. This reduces repeated context while keeping full evidence recoverable.

## Relevant sources
- Cloudflare issue #2014: https://github.com/cloudflare/agents/issues/2014
- Hermes issue #79818: https://github.com/NousResearch/hermes-agent/issues/79818
- Hermes issue #86401: https://github.com/NousResearch/hermes-agent/issues/86401
- Agenta issue #5341: https://github.com/Agenta-AI/agenta/issues/5341
- Zed issue #59401: https://github.com/zed-industries/zed/issues/59401
- Cloudflare conversation state/memory docs: https://developers.cloudflare.com/agents/concepts/conversation-state-and-memory/