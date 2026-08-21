# Research — Agent Context Refill Thrash Profiler

## Problem
Long-running AI coding sessions can enter a compaction loop: context is compacted, then static project instructions, tool state, or other payloads are re-injected so aggressively that the context window refills within only a few turns. The session repeatedly compacts, spends tokens on overhead instead of work, and may eventually stall or lose recoverable state.

## Category
**Token**

## Why it matters now
Recent public issue reports in both Claude Code and Codex describe compaction-related failure modes that waste context budget and reduce forward progress.

## Current public signals

### Signal 1 — Claude Code autocompact thrashing from re-injected project instructions
Anthropic Claude Code issue #85489, opened 2026-08-10, reports sessions with large `.claude/rules/*.md` plus `CLAUDE.md` repeatedly refilling to the context limit immediately after compaction. The reporter measured one case where a 248 KB instruction directory caused roughly 122K tokens of re-injection in one turn on top of roughly 198K post-compact residue, producing another compaction trigger. The same session recorded 16 compactions in 1h48m with little forward progress.

Source: https://github.com/anthropics/claude-code/issues/85489

### Signal 2 — Codex long-running sessions become large and hard to inspect after repeated compaction
OpenAI Codex issue #38466, opened 2026-08-14, reports a long-running Desktop session becoming huge and difficult to inspect after repeated compaction, with thread-read output itself becoming truncated. This shows a second implementation where long-lived session state and compaction interact poorly with context observability and recoverability.

Source: https://github.com/openai/codex/issues/38466

### Signal 3 — Codex can lose recoverable tool state after truncation + compaction
OpenAI Codex issue #37121, opened 2026-08-05, documents a large function result being truncated before compaction; after compaction, continuation lost access to recoverable persisted tool state and incorrectly concluded data was missing. This demonstrates why simply deleting or over-summarizing context to stop refill is unsafe: compacted systems still need durable references to required state.

Source: https://github.com/openai/codex/issues/37121

## Existing approaches

### Automatic compaction
Agents summarize older context when approaching model limits.

**Limitation:** compaction controls residue size but not necessarily post-compaction re-injection. If unchanged instructions or session attachments are resent verbatim, the window can refill immediately.

### User-driven `/compact` or manual restarts
Users compact, clear, restart, or fork a session when it becomes too large.

**Limitation:** manual action has poor observability: users often do not know which context source is consuming the refill budget. Restarting can also lose state.

### Generic warnings about large files/tool output
Harnesses may warn that one file or tool result is too large.

**Limitation:** issue #85489 reports misattribution where the actual cause was repeated instruction re-injection, not a single oversized payload.

### Summarize everything aggressively
A host can reduce the post-compact residue.

**Limitation:** issue #37121 shows that required tool state may become inaccessible if summaries do not retain durable references to recoverable artifacts.

## Observed evidence / Interpretation / Proposed solution

### Observed evidence
- Context can refill to the model limit within a few turns after compaction.
- Repeated static instruction re-injection can dominate token usage.
- Compaction can make previously persisted tool state effectively invisible.
- Existing warnings may not attribute refill to the correct source.

### Interpretation
The missing engineering control is a **post-compaction refill budget with source attribution**. The host should measure how many tokens each category adds after compaction and reject or transform redundant re-injection before the session re-enters the threshold.

### Proposed engineering solution
Build a deterministic profiler/gate that consumes per-turn context accounting records and computes:
1. refill velocity after each compaction;
2. token contribution by source (`system`, `project_instruction`, `tool_result`, `file_read`, `memory`, `history_summary`, `other`);
3. duplicate/static payload fingerprints;
4. compaction interval collapse;
5. policy violations when refill exceeds configured budgets.

Safe mitigations are policy-driven: reference unchanged static content by digest, load instructions hierarchically/on demand, cap source-specific refill, preserve durable artifact IDs, and fail closed when required context would be lost.

## Root-cause hypotheses
1. Static instructions are treated as required verbatim payloads on every post-compact turn.
2. No per-source token accounting exists at the orchestration boundary.
3. Compaction policies optimize total history size but ignore refill velocity.
4. Identical payloads are not deduplicated by digest/reference.
5. Required tool artifacts lack durable references and therefore are kept verbatim or lost entirely.
6. Stop conditions detect context-full but not repeated compaction cycles with declining useful-work ratio.

## Improvement target
A successful integration should demonstrate on representative traces:
- at least 50% reduction in duplicated post-compaction static tokens where duplicate static payloads exist;
- zero loss of required artifact references;
- no more than the configured maximum compactions within the rolling window;
- refill within the configured fraction of the context window after `N` post-compact turns;
- explicit attribution for at least 95% of measured input tokens;
- no quality regression on a fixed verification suite.

## Success metrics
- `tokens_per_task`
- `post_compact_refill_tokens`
- `refill_ratio = refill_tokens / context_window`
- `refill_velocity_tokens_per_turn`
- `duplicate_static_tokens`
- `duplicate_static_ratio`
- `compactions_per_100_turns`
- `median_turns_between_compactions`
- `attribution_coverage`
- `required_artifact_reference_loss_count`
- verification-suite pass rate

## Sources
1. Anthropic Claude Code #85489 — https://github.com/anthropics/claude-code/issues/85489 — opened 2026-08-10.
2. OpenAI Codex #38466 — https://github.com/openai/codex/issues/38466 — opened 2026-08-14.
3. OpenAI Codex #37121 — https://github.com/openai/codex/issues/37121 — opened 2026-08-05.
