# Research

## Topic
Compaction trigger source-of-truth integrity

## Category
Token

## Problem
Token counters serving different semantics—billing totals, cache accounting, run-accumulated usage, current prompt occupancy—can be collapsed into one `totalTokens` field. When that field is trusted by compaction, healthy sessions compact early or repeatedly.

## Why it matters now
A high-confidence OpenClaw report opened 2026-08-03 documents premature compaction at only 4–8% of a configured 1M-token window because cumulative multi-call usage was persisted as current context. A separate 2026-08-01 report observed 1,515,840 persisted tokens while the last-call context was about 81,174, causing repeated compactions. An older 2026 report documented cache-token accounting driving the same class of premature compaction, showing recurrence across implementations/paths.

## Affected users
Long-running agent users, gateway/webchat runtimes, tool-heavy sessions, platform teams implementing context compaction, and providers with prompt caching.

## Current public evidence
### Observed evidence
1. OpenClaw #118772, opened 2026-08-03: `sessionEntry.totalTokens` inflation causes compaction at 4–8% utilization; the report includes source-level reproduction and notes 160k+ tokens of real conversation summarized unnecessarily. https://github.com/openclaw/openclaw/issues/118772
2. OpenClaw #117511, opened 2026-08-01: a multi-call gateway turn persisted run-accumulated usage (1.5M) as a fresh context snapshot while the actual last call was ~81k, causing six compactions in one day. https://github.com/openclaw/openclaw/issues/117511
3. OpenClaw #15006: cache read/write accounting was counted as context usage, causing sessions to compact every 11–33 minutes. https://github.com/openclaw/openclaw/issues/15006
4. OpenClaw #115143, opened 2026-07-28: metadata did not reset after compaction and accumulated to 1.88M against a 131k limit, permanently breaking auto-compaction. https://github.com/openclaw/openclaw/issues/115143

## Interpretation
The recurring weakness is semantic aliasing: a numeric token total is treated as context occupancy without proof of provenance, freshness, or scope. Fixing one writer/path does not protect other writers that can stamp a cumulative value as fresh.

## Existing approaches
Last-call usage guards, provider-specific token formulas, post-compaction metadata refresh, and UI context meters.

## Remaining limitations
Writer-by-writer fixes are fragile; field names do not encode semantics; cache/billing/context counters are easy to mix; a `fresh` boolean can certify the wrong quantity; post-compaction updates can remain stale.

## Root-cause analysis
1. Untyped token metrics share storage fields.
2. Compaction consumers trust freshness without source provenance.
3. Multi-call tool loops aggregate usage while context occupancy is a point-in-time quantity.
4. Cache accounting semantics differ by provider.
5. Regression tests cover individual code paths rather than the invariant at the compaction boundary.

## Improvement opportunity
Enforce the invariant immediately before compaction: threshold input MUST be a fresh current-prompt snapshot from an approved source; cumulative/run/cache totals MUST NOT substitute. Record source and timestamp and recompute when ambiguous.

## Goal
Zero compaction decisions driven by cumulative or stale usage while preserving genuine over-budget compaction.

## Metrics
Compaction utilization percentile, false-compaction rate, compactions/session-hour, summary tokens/task, recomputation count, and quality regression after compaction.

## Trigger
Before every automatic compaction decision and after each completed compaction.

## Inputs
Current prompt token count, source/provenance, freshness, context-window size, threshold, cumulative usage, cache usage.

## Outputs
ALLOW_NO_COMPACT, REQUIRE_COMPACT, or BLOCK_RECOMPUTE with evidence.

## Proposed solution
Use a typed pre-compaction gate plus regression fixtures that explicitly separate current occupancy from cumulative accounting.
