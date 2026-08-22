# Research — Compaction Read Ledger Continuity Guard

## Topic
Compaction Read Ledger Continuity Guard

## Category
Token

## Problem
Long-running agents can repeatedly resend large tool outputs and then re-read unchanged files after context compaction because deduplication/read state is not durable across the compaction boundary. This compounds token cost and latency while adding no new task information.

## Why it matters now
A Hermes Agent issue opened 2026-08-12 reports stable cache-read/input ratios around 15–18× in long sessions and identifies loss of `read_file` dedup state after compaction. A separate OpenAI Codex issue from 2026-07-01 reports that large command outputs can become very large model-visible payloads, bloating context and making transcripts expensive. These are independent signals that tool-result lifecycle, not only prompt size, is a current context-cost bottleneck.

## Affected users
Developers running long coding-agent sessions, agent framework maintainers, platform teams paying model token costs, and users of agents that repeatedly read repositories or emit large command results.

## Current public evidence
### Observed evidence
1. NousResearch/hermes-agent issue #84857, opened 2026-08-12, reports tool outputs being resent every turn and `read_file` dedup state being lost across context compaction; the report describes cache-read/input ratios of roughly 15–18× across sessions and re-reading of unchanged large files after compaction: https://github.com/NousResearch/hermes-agent/issues/84857
2. openai/codex issue #30831, opened 2026-07-01, reports large shell/unified-exec outputs becoming large model-visible/UI-visible payloads and proposes bounded inline previews with searchable local artifacts: https://github.com/openai/codex/issues/30831
3. anthropics/claude-code issue #84750, opened 2026-08-07, reports a significant recent increase in token consumption without a workflow change, reinforcing the operational importance of measurable session-level token regressions: https://github.com/anthropics/claude-code/issues/84750

## Existing approaches
- Per-tool output byte/token limits and truncation.
- Context compaction/summarization when thresholds are reached.
- In-memory read deduplication inside a task/session.
- Prompt caching for repeated prefixes.
- Manual partial file reads or filtering of large command output.

## Remaining limitations
Truncation bounds a single result but does not prevent repeated transmission of the same result. Compaction can discard ephemeral read/dedup state, causing unchanged artifacts to be fetched and injected again. Prompt caching may reduce billed processing depending on provider semantics but does not remove replayed context from logical context occupancy, nor does it ensure the agent knows an unchanged artifact was already captured.

## Root-cause analysis
- Read identity and content hash are kept only in ephemeral task state.
- Context compaction rebuilds state without a durable artifact ledger.
- Tool history stores payloads rather than stable content-addressed references.
- Re-read decisions are not checked against artifact version/hash.
- Teams measure total tokens but often lack a replay-specific ratio that reveals duplicate unchanged content.

## Improvement opportunity
Maintain a compact content-addressed read ledger across compaction. Record artifact key, content hash/version, first-read turn, last-read turn, token size, and whether the content is represented by the compacted summary. After compaction, unchanged artifacts should resolve to a lightweight reference/stub unless the caller explicitly needs a different range or the underlying version changed. Profile duplicate token replay before and after the change.

## Interpretation
The evidence does not imply all repeated context is waste: some tool results are required for correctness and some providers efficiently cache prefixes. The target is specifically repeated unchanged artifact payloads and duplicate reads that add no new evidence. Required context must not be discarded merely to save tokens.

## Proposed solution
Use `scripts/read_replay_guard.py` to measure same-content duplicate reads and post-compaction replay. Persist a framework-specific read ledger outside transient model history, restore it after compaction, and use artifact references or bounded previews for already-known unchanged content. Verify quality on representative tasks before accepting token savings.

## Goal
Reduce duplicate unchanged tool-result tokens across long sessions and compaction without losing required evidence or decreasing task quality.

## Metrics
- Duplicate same-content read tokens / total read tokens.
- Duplicate reads after compaction.
- Estimated wasted duplicate tokens per task.
- Cache-read/input ratio when provider metrics exist.
- Tokens/task, latency/task, task-quality pass rate, regression rate.

## Trigger
Context compaction, repeated file/tool read, long-session token threshold, or token-cost regression.

## Inputs
Read/tool-result events with artifact key, content hash, token size, turn, compaction markers, and optional provider usage metrics.

## Outputs
Replay profile, threshold pass/block decision, duplicate artifact list, post-compaction duplicates, and before/after metrics.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/84857
- https://github.com/openai/codex/issues/30831
- https://github.com/anthropics/claude-code/issues/84750
