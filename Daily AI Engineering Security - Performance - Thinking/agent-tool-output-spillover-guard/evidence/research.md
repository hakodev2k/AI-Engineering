# Research — Agent Tool Output Spillover Guard

Research date: 2026-08-19 (UTC+7)

## Problem

Agent harnesses often inject complete tool results into the model conversation. A single broad search, verbose build, large file read, diagnostics dump, image/base64 payload, or MCP result can consume a disproportionate share of the context window. The opposite mitigation—fixed line/byte truncation—can hide the exact errors or middle-of-output evidence the model needs. This creates a recurring engineering trade-off: **retain everything and risk token/cost/context failure, or truncate aggressively and risk correctness failure**.

Primary category: **Token**.

Affected users: coding-agent users, AI platform teams, MCP developers, CI/headless agent runners, multi-agent orchestrators, and teams that persist tool history across long-running sessions.

## Observed evidence

### Signal 1 — Codex oversized tool outputs and quota/context burn

OpenAI Codex issue #16664 (opened 2026-04-03) reports a `function_call_output` with an original token count of 948,372 and 23,781 lines after a broad repository search. The report describes large outputs entering context and making later turns expensive. Proposed remedies include hard token caps, summarization/truncation and warnings.

Source: https://github.com/openai/codex/issues/16664

### Signal 2 — Codex auto-compaction can use stale usage after a large tool result

OpenAI Codex issue #32888 (opened 2026-07-13, still open when researched) reports that a large tool result can push the next request beyond the effective context window because compaction decisions use previously reported token usage and do not account for the newly appended result soon enough.

Source: https://github.com/openai/codex/issues/32888

### Signal 3 — Claude Code context overflow and autocompact thrashing

Claude Code issue #80787 (opened 2026-07-24) reports repeated auto-compaction thrashing where context refills within a few turns, with the error explicitly identifying large file reads or tool outputs as likely causes.

Source: https://github.com/anthropics/claude-code/issues/80787

Claude Code issue #13831 documents a headless/noninteractive failure mode where one oversized tool result can make the session irrecoverable; the feature request specifically proposes per-tool output budgets and programmatic rewind/recovery.

Source: https://github.com/anthropics/claude-code/issues/13831

### Signal 4 — Naive truncation loses useful information

OpenAI Codex issue #6426 argues that line-based head/tail truncation does not correlate with token usage and can hide critical middle sections such as build failures, test failures, or relevant code. This demonstrates that simply lowering output limits is not sufficient.

Source: https://github.com/openai/codex/issues/6426

### Signal 5 — Truncation plus compaction can lose recoverable state

OpenAI Codex issue #37121 (opened 2026-08-05) reports that after a large function result is truncated and the thread compacts, a continuation can lose access to data that still exists in persisted rollout state.

Source: https://github.com/openai/codex/issues/37121

### Signal 6 — Existing protocol/framework primitives support out-of-band payloads

The Model Context Protocol tool result format supports `resource_link`, allowing a tool to return a URI rather than embedding all data directly in the model-visible result. That provides a standards-compatible primitive for keeping large data fetchable on demand.

Source: https://modelcontextprotocol.io/specification/2025-11-25/server/tools

LangChain `ToolMessage.artifact` stores supplementary data that is available programmatically but is not sent to the model. This is another concrete existing primitive for separating raw tool payloads from model context.

Source: https://docs.langchain.com/oss/python/langchain/messages

## Existing approaches

1. **Full ingestion** — simplest and preserves all evidence, but large results consume context repeatedly and may make long-running sessions expensive or unrecoverable.
2. **Fixed line/byte truncation** — bounds payload size but is poorly aligned with actual token usage and can hide important information in the middle.
3. **Automatic conversation compaction** — controls total history size, but compaction occurs after output has already entered the session and can itself fail/thrash near the limit.
4. **Prompt instructions such as “use grep/head”** — useful guidance but not enforceable; the model can still execute a broad tool call or a tool can unexpectedly return large output.
5. **Framework artifacts/resource links** — useful primitives, but applications must still define budgets, extraction policy, persistence, integrity checks, retrieval semantics and verification.

## Observed limitations

- Output limits are often expressed in lines/bytes instead of a context-aware budget.
- A single call can consume most remaining context before a later compaction step reacts.
- Head/tail truncation can discard the highest-value diagnostic evidence.
- Raw output may be persisted and resent even when only a small subset is needed for reasoning.
- “Summarize everything” adds a model call, cost and possible summary drift.
- Out-of-band artifact support is framework-specific unless a portable envelope and storage contract is defined.
- Recovery is weak if the truncated portion is no longer addressable by a stable reference.

## Root-cause hypotheses

1. Tool execution and context assembly are treated as one path instead of two separate data planes: raw execution data versus model-visible evidence.
2. Harnesses lack an explicit per-result context budget derived from remaining context and task policy.
3. Truncation is presentation-oriented rather than evidence-oriented.
4. Raw outputs are not given stable content-addressed identities, so later retrieval cannot reliably rehydrate omitted sections.
5. Metrics usually track request-level token usage but not `raw_tool_tokens`, `visible_tool_tokens`, spill rate, rehydration count and evidence-loss regressions.

## Improvement target

Introduce a reusable **Budget → Extract → Spill → Reference → Rehydrate** boundary:

1. Capture raw tool result once.
2. Measure deterministic size/token estimate before model ingestion.
3. If within budget, pass it unchanged.
4. If over budget, persist the raw payload as a content-addressed artifact.
5. Build a bounded model-visible excerpt that prioritizes matched error/failure/warning lines plus head/tail context.
6. Return an envelope containing artifact URI/path, SHA-256, raw/visible sizes and retrieval instructions.
7. Allow bounded, range-based rehydration when the model later needs omitted evidence.
8. Track token reduction and answer/test quality so savings are not achieved by silently removing required information.

## Success metrics

- `visible_estimated_tokens / raw_estimated_tokens` for spilled outputs.
- Total tool-result tokens per task.
- Number and percentage of tool calls spilled.
- Rehydration calls per spilled output.
- Context-overflow/autocompact-thrashing incidents.
- Task/test success rate before versus after guard adoption.
- Evidence-loss regression rate: cases where required evidence existed only in omitted data and was not recoverable.
- Integrity failures: SHA mismatch or missing artifact; target is zero accepted corrupted artifacts.

## Interpretation

The evidence supports a problem broader than any single CLI bug: **large tool outputs need a first-class data-lifecycle policy, not only a display truncation rule**. The reusable opportunity is to keep complete data outside model context while preserving deterministic, integrity-checked access to it.

## Proposed engineering solution

This package implements framework-neutral scripts and procedures for tool-output budgeting, evidence-focused excerpting, content-addressed spill storage, integrity verification, range retrieval and regression testing. It does not claim that every provider must use the same tokenizer; the reference implementation uses a conservative deterministic estimator and exposes the estimate in metadata. Integrations may replace the estimator with their provider tokenizer without changing the spill/reference contract.
