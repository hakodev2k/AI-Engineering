# Research — Agent Prompt Cache Invalidation Sentinel

## Problem
Long-running AI coding sessions can unexpectedly lose prompt-cache reuse and re-write hundreds of thousands of previously processed tokens. The session still appears functional, so the failure can silently multiply cost and latency until usage limits are hit.

## Category
**Token**

## Why it matters now
Recent August 2026 issue reports show repeated, measurable prompt-cache collapse in long Claude Code sessions and related long-running-agent workflows. The failure modes vary—history rebuilds, TTL behavior, updates, mixed clients—but the operational symptom is the same: a large stable prefix that should be reused is re-created again.

## Current public signals

### Signal 1 — repeated cache drops caused ~10.4M redundant writes
Claude Code issue #83542, opened August 3, 2026, reports a session where cache reuse repeatedly collapsed and about 10.4M tokens were redundantly written. The reporter compared request-level transcript usage and observed repeated drops in `cache_read_input_tokens` followed by large cache creation.

Source: https://github.com/anthropics/claude-code/issues/83542

### Signal 2 — ~950k context repeatedly re-written
Claude Code issue #85326, opened August 9, 2026, reports a ~950k-token session where cache reads repeatedly fell back to a much smaller prefix and the full context was re-written, consuming roughly half of a five-hour usage window in about 50 minutes.

Source: https://github.com/anthropics/claude-code/issues/85326

### Signal 3 — hook additionalContext can invalidate cached history
Claude Code issue #83913, opened August 4, 2026, reports a controlled reproduction where `PreToolUse`/`PostToolUse` `additionalContext` changes during history rebuild caused the next ordinary request to miss a still-valid prefix and rewrite it.

Source: https://github.com/anthropics/claude-code/issues/83913

### Signal 4 — cache TTL regression report
Claude Code issue #84253, opened August 5, 2026, reports that versions 2.1.218+ stopped requesting the one-hour prompt-cache TTL in the observed environment, causing full rewrites after five-minute gaps.

Source: https://github.com/anthropics/claude-code/issues/84253

### Signal 5 — background update can invalidate resumed sessions
Claude Code issue #86244, opened August 13, 2026, reports that a background auto-update invalidated existing session prompt caches so the next resume re-cached the full context.

Source: https://github.com/anthropics/claude-code/issues/86244

### Cross-platform design signal
OpenAI Codex issue #27008 proposes durable inference/session state for long-running tasks because hours-long pauses can force expensive re-processing of repository context, task history, tool outputs, plans, and decisions.

Source: https://github.com/openai/codex/issues/27008

## Existing approaches

### Provider-side prompt caching
Prompt caching reduces repeated-prefix cost and latency when cache keys/prefixes remain reusable.

**Limitation:** application code often treats cache behavior as an opaque optimization. If the prefix mutates, TTL changes, client versions differ, or history serialization changes, users may not receive a clear local signal before significant waste occurs.

### Transcript inspection after an incident
Developers can inspect JSONL/transcript usage counters manually.

**Limitation:** diagnosis occurs after cost/latency damage, and manual grouping by request IDs is tedious for large sessions.

### Usage-limit alerts
Account usage dashboards expose aggregate spend or limit consumption.

**Limitation:** they identify the outcome, not whether repeated cache creation is the cause, which request first regressed, or whether a specific client/hook transition correlates with the event.

### Shorter sessions / manual restarts
Users may start fresh sessions to avoid pathological long-context behavior.

**Limitation:** this sacrifices useful context and can increase re-processing by design. It is a workaround, not a diagnostic control.

## Observed limitations
- Cache degradation may be silent at the task level.
- Aggregate usage cannot distinguish useful new context from repeated prefix rewrites.
- Different systems expose different usage field layouts.
- A single miss can be legitimate; repeated large rewrites are the actionable pattern.
- Root cause cannot safely be inferred from token counters alone.

## Root-cause hypotheses
These are hypotheses, not universal claims:
1. history serialization changes alter otherwise stable prefixes;
2. hook/tool metadata injects dynamic content into cached regions;
3. client/version changes alter system prompts or cache-control behavior;
4. TTL expiry causes full prefix recreation after pauses;
5. concurrent/resumed clients create divergent system context;
6. auto-update boundaries invalidate cache identity.

## Improvement target
Build a deterministic sentinel around per-request usage data that:
- establishes a baseline cache-read ratio and rewrite volume;
- detects abrupt cache-read collapse followed by large cache creation;
- distinguishes isolated misses from repeated rewrite thrash;
- records only metadata required for diagnosis, never prompt content;
- emits machine-readable incidents with request/time/version/miss-reason context when available;
- blocks automatic "optimized" claims unless before/after measurements exist.

## Success metrics
- `cache_read_ratio = cache_read / max(cache_read + cache_creation + uncached_input, 1)`
- `rewrite_tokens` per request and per session
- repeated-thrash count within a bounded request/time window
- redundant-write estimate relative to a healthy warm-cache baseline
- detection precision on labeled regression fixtures
- zero prompt/tool content required for detection

## Proposed engineering solution
A **Prompt Cache Invalidation Sentinel** that parses usage events, normalizes provider/client-specific fields, computes cache-read/write ratios, tracks warm-cache baselines, and raises bounded incidents when a previously warm session repeatedly falls below configured cache-read thresholds while cache creation exceeds an absolute or relative threshold.

The sentinel does **not** attempt to repair provider caches. It provides early detection, reproducible evidence, and a workflow for isolating client/version/hook/TTL transitions before more tokens are burned.

## Sources
1. Anthropic Claude Code #83542 — https://github.com/anthropics/claude-code/issues/83542 — 2026-08-03.
2. Anthropic Claude Code #83913 — https://github.com/anthropics/claude-code/issues/83913 — 2026-08-04.
3. Anthropic Claude Code #84253 — https://github.com/anthropics/claude-code/issues/84253 — 2026-08-05.
4. Anthropic Claude Code #85326 — https://github.com/anthropics/claude-code/issues/85326 — 2026-08-09.
5. Anthropic Claude Code #86244 — https://github.com/anthropics/claude-code/issues/86244 — 2026-08-13.
6. OpenAI Codex #27008 — https://github.com/openai/codex/issues/27008.
7. OpenAI API pricing shows distinct cached-input and cache-write pricing for current models — https://platform.openai.com/pricing
