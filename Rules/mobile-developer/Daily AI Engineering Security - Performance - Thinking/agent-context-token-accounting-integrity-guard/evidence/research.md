# Research — Agent Context Token Accounting Integrity Guard

## Topic
Agent Context Token Accounting Integrity Guard

## Category
Token

## Problem
Long-running agents can make compaction, eviction, UI, and budget decisions from corrupted or semantically wrong token counters. In multi-call tool loops, cumulative usage can be mistaken for the current prompt/context size. This can trigger premature compaction, context churn, false "100% full" indicators, state loss, or permanent compaction failure even when the real prompt is far below the model window.

## Why it matters now
A cluster of OpenClaw reports in July–August 2026 documents distinct but related accounting failures. A high-confidence August 3 report describes premature compaction at only 4–8% of configured context because `sessionEntry.totalTokens` was inflated by cumulative run usage. An August 1 sibling report observed 1.5M displayed tokens while the actual per-call context was about 81K. A July report shows token metadata failing to reset after compaction and reaching 1.88M against a 131K window. These are not generic "large context" complaints; they show a reproducible correctness problem in the measurement used to control compaction.

## Affected users
Agent-runtime developers, framework maintainers, platform teams implementing context compaction, users of long tool-loop sessions, self-hosted model users, and observability teams relying on context-utilization metrics.

## Current public evidence
### Observed evidence
1. OpenClaw issue #118772, opened 2026-08-03, reports `sessionEntry.totalTokens` inflation causing premature compaction at 4–8% of context and labels the issue P0/data-loss/session-state with a source-level reproduction. Source: https://github.com/openclaw/openclaw/issues/118772
2. OpenClaw issue #117511, opened 2026-08-01, reports a multi-call turn persisting run-accumulated usage as the context snapshot: 1,515,840 persisted vs ~81,174 observed on the last call, causing repeated compaction. Source: https://github.com/openclaw/openclaw/issues/117511
3. OpenClaw issue #115143, opened 2026-07-28, reports `totalTokens` metadata not resetting after compaction, eventually reaching 1,883,759 against a 131,072 context limit and causing permanent auto-compaction failure. Source: https://github.com/openclaw/openclaw/issues/115143
4. OpenClaw issue #107324 reports inconsistency between per-run usage persistence and the aggregate `totalTokens`/freshness state after compaction. Source: https://github.com/openclaw/openclaw/issues/107324
5. OpenClaw issue #103930 documents a different token-estimation correctness problem: raw chars/4 estimation can substantially mis-budget CJK sessions, showing that context-control decisions are sensitive to estimator semantics as well as aggregation. Source: https://github.com/openclaw/openclaw/issues/103930

## Existing approaches
- Trust provider-reported usage totals from each response.
- Accumulate per-call input/output/cache token usage into a session total.
- Store a `totalTokens` plus freshness flag in session metadata.
- Trigger compaction when the stored counter exceeds a threshold.
- Estimate prompt tokens from characters when provider usage is unavailable.
- Reset or rewrite metadata during compaction.

## Remaining limitations
The same field can accidentally represent different quantities: cumulative billed usage, last request input context, current serialized prompt estimate, or post-compaction session size. A freshness flag does not fix semantic mismatch. Compaction may update transcript state and token state through separate paths, creating stale counters. Provider cache-read/write accounting can be incorrectly mixed into context occupancy. Approximate token estimators can be language-biased.

## Root-cause analysis
- Missing type/semantic distinction between `usage_total` and `context_occupancy`.
- Aggregates are persisted without invariant checks against the configured model window and latest request.
- Multi-tool loops sum repeated context across calls, even though repeated input is billed repeatedly but does not mean the next prompt contains the sum.
- Compaction bookkeeping may update transcript and metadata non-atomically.
- `fresh=true` can describe recency while the value is still the wrong metric.
- Fallback estimators lack calibration or error bounds.

## Improvement opportunity
Introduce a token-accounting contract with separate fields for current input context, generated output, cached reads/writes, cumulative billed usage, estimated serialized context, and context-window capacity. Before a context-management decision, validate invariants and reject implausible occupancy values. After compaction, require a new occupancy measurement/estimate tied to a transcript revision hash. Never trigger destructive compaction solely from cumulative usage.

## Goal
Make context-management decisions from a traceable current-context measurement rather than an ambiguous cumulative token counter.

## Metrics
- 100% context-management decisions identify the metric source and semantic type.
- 0 compaction triggers from `cumulative_usage` alone.
- Occupancy-to-window ratio stays within defined invariant bounds unless an actual oversized prompt is reproducibly serialized.
- 100% post-compaction occupancy values bind to the current transcript revision.
- Difference between measured/provider input tokens and fallback estimate is tracked; configured tolerance violations block automatic destructive compaction.
- Regression fixtures detect run-sum inflation, stale post-compaction metadata, cache-token mixing, and estimator error.

## Trigger
Before compaction/eviction, after a model response, after transcript mutation, after compaction, on model/context-window changes, and when UI/observability reports context utilization.

## Inputs
Per-call provider usage, transcript revision/hash, serialized prompt or estimator result, cache token fields, configured context window, compaction revision, and historical session usage.

## Outputs
Typed token-accounting snapshot, invariant findings, safe/unsafe decision for automatic compaction, occupancy ratio, measurement source, confidence/tolerance, and regression evidence.

## Interpretation
These reports are concentrated in OpenClaw and do not prove that all agent frameworks share the same implementation defect. They expose a general reusable engineering hazard: billing usage and current context occupancy are different metrics but often flow through similarly named fields.

## Proposed solution
A reusable accounting schema, deterministic integrity validator, baseline/verification workflow, and pre-compaction blocking hook. The package does not attempt to replace provider tokenizers; it prevents ambiguous or inconsistent measurements from silently driving destructive context management.