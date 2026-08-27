# Research — Aggregate Tool Output Context Budget Guard

**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent many medium-sized tool results in one agent turn from collectively overflowing the next model request and defeating compaction.

## Problem
Agent runtimes commonly truncate only individually huge tool outputs or compact only after the transcript is already oversized. Multi-step agents can emit many moderate web/file/exec results that are each below per-result thresholds but collectively consume the remaining context budget. The next request then exceeds the model limit, retries fail, compaction thrashes, or conversation state is reset.

## Why it matters now
Recent production reports show the problem remains active in 2026, including a July/August OpenClaw report with many medium outputs accumulating to hundreds of KB and an Anthropic Agent SDK report where context refills within about three turns after compaction.

## Affected users
Long-running agents, coding agents, multi-agent workflows, RAG/tool-heavy services, and platform teams paying for repeated compaction/retries.

## Current public evidence

### Observed evidence
1. **OpenClaw #113701 — opened 2026-07-25; additional production evidence posted 2026-08-17.** Multiple 30–80 KB tool results can collectively overflow context even though each stays below individual truncation thresholds. A later production data point reports ~154 bash tool results of ~20 KB each (~668 KB total) in one turn, after which compaction could not recover.  
   https://github.com/openclaw/openclaw/issues/113701
2. **Anthropic Claude Agent SDK Python #958 — opened 2026-05-15.** Autocompact repeatedly refills to the limit within three turns, with large files/tool outputs identified as likely triggers; the report requests automatic chunking or prevention of oversized context refill.  
   https://github.com/anthropics/claude-agent-sdk-python/issues/958
3. **OpenClaw #9140 — opened 2026-02-04.** Unbounded tool outputs caused a 225,881-token prompt against a 200,000-token limit; compaction ran repeatedly but could not shrink single-turn payloads.  
   https://github.com/openclaw/openclaw/issues/9140
4. **Hermes Agent #13164 — opened 2026-04-20.** Large tool results can consume the protected tail-token budget during compression, pushing actual conversation messages into summarized history and degrading task continuity.  
   https://github.com/NousResearch/hermes-agent/issues/13164

### Interpretation
The common weakness is budget enforcement after insertion rather than before insertion, plus per-result thresholds that ignore aggregate per-turn growth. This is a context-accounting problem, not merely a request for a larger context window.

## Existing approaches
- Per-result byte/token truncation.
- Reactive auto-compaction.
- Manual `/clear`, `/new`, or explicit compaction.
- Reading files/tool outputs in smaller chunks.
- Tail-preservation budgets during summary/compression.

## Remaining limitations
- Individually safe results can collectively exceed the turn budget.
- Reactive compaction may run only after irreversible context growth.
- Crude truncation can remove correctness-critical evidence.
- Token estimates vary by model/provider.
- Retry loops may repeat the same oversized prompt and multiply cost.

## Root-cause analysis
1. No cumulative per-turn admission budget for tool results.
2. Context limit, reserved output budget, and safety margin are not enforced together before each model call.
3. Tool adapters lack importance metadata for selective retention.
4. Raw outputs are persisted before summarization/reference extraction.
5. Recovery retries lack a stop condition tied to unchanged context size.

## Improvement opportunity
Add a deterministic pre-insertion/pre-request budget guard that tracks cumulative tool-result bytes/tokens, reserves required output headroom, rejects or externalizes overflow, preserves small evidence excerpts plus stable references, and blocks identical retry loops. Quality-critical context is retained by priority rather than blind truncation.

## Relevant sources
- OpenClaw #113701: https://github.com/openclaw/openclaw/issues/113701
- Anthropic Agent SDK Python #958: https://github.com/anthropics/claude-agent-sdk-python/issues/958
- OpenClaw #9140: https://github.com/openclaw/openclaw/issues/9140
- Hermes Agent #13164: https://github.com/NousResearch/hermes-agent/issues/13164
