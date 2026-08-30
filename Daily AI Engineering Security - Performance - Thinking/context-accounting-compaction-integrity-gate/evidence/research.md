# Research

## Topic
Context Accounting Compaction Integrity Gate

## Category
Token

## Problem
Long-running AI agents often maintain several token notions at once: per-call provider usage, cumulative run usage, cache accounting, transcript estimates, current prompt occupancy, and configured context-window capacity. When these values are conflated, compaction decisions become unsafe and expensive.

## Why it matters now
Recent August 2026 reports show production agent runtimes persisting cumulative multi-call usage as if it were a fresh current-context snapshot and then triggering destructive compaction at very low true utilization. The failure causes unnecessary summarization calls, context loss, misleading status output, and repeated churn.

## Affected users
Agent-runtime developers, platform engineers, coding-agent users, operators of long-lived tool-heavy sessions, and teams paying for high-context models.

## Current public evidence
### Observed evidence
1. **OpenClaw #117511, opened 2026-08-01.** A long multi-call tool-use turn persisted about 1.5M cumulative tokens as session `totalTokens` although the final current context was about 81k; this triggered repeated compactions. https://github.com/openclaw/openclaw/issues/117511
2. **OpenClaw #118772, opened 2026-08-03.** Reports premature destructive compaction at 4–8% of configured context because cumulative run usage was treated as current prompt size; issue marked data-loss/P0 and linked to a fix PR. https://github.com/openclaw/openclaw/issues/118772
3. **OpenClaw #118678, opened 2026-08-03.** Reports disagreement between configured/session context limits and an embedded precheck using a lower effective budget, causing tool-heavy turns to be rejected despite status showing more capacity. https://github.com/openclaw/openclaw/issues/118678
4. **Hermes Agent #80449, opened 2026-08-06.** Reports a single oversized tool-calling turn can remain wholly protected and exceed the compressor tail budget, showing that compaction control also needs explicit turn-shape and reclaimability checks. https://github.com/NousResearch/hermes-agent/issues/80449
5. Earlier OpenClaw #15006 and #13853 document cache-token accounting inflating context percentages and causing premature compaction, demonstrating recurrence of the semantic-metric problem. https://github.com/openclaw/openclaw/issues/15006 ; https://github.com/openclaw/openclaw/issues/13853

## Interpretation
The recurring root problem is not merely an incorrect arithmetic formula. It is weak typing/provenance of token metrics: accounting totals, cache metrics, current occupancy, and estimates can flow through the same fields and fallback branches, while compaction assumes they mean the same thing.

## Existing approaches
- provider usage blocks for each model call;
- cumulative run/session cost accounting;
- transcript token estimators;
- context-window thresholds and reserve budgets;
- automatic summarization/compaction;
- provider prompt caching and cache-read/write counters.

## Remaining limitations
- a cumulative total can be numerically valid but semantically invalid for occupancy;
- stale snapshots may be marked fresh or used as fallbacks;
- cache accounting semantics differ by provider;
- successful compaction logs do not always prove meaningful token reclamation;
- status/UI metrics can hide ambiguity and induce incorrect operator action.

## Root-cause analysis
1. Token values lack explicit semantic type and provenance.
2. Fallback logic prefers “some token value” over “known current occupancy.”
3. Freshness is represented separately and can become inconsistent.
4. Compaction decisions are not always accompanied by the exact source metric.
5. Post-compaction verification may check completion but not actual reclaim percentage or quality retention.

## Improvement opportunity
Create a deterministic gate that accepts only explicit, fresh occupancy sources for destructive compaction; separately records cumulative billing usage; validates bounds; checks reclaimability; circuit-breaks repeated low-value compactions; and requires before/after and quality evidence.

## Goal
Lower unnecessary compaction, token cost, latency, and context loss without allowing real context overflow.

## Metrics
False-positive compaction rate; current occupancy/window ratio; cumulative/current ratio; compactions/task; tokens reclaimed/compaction; latency/task; cost/task; quality regression rate.

## Trigger
Before automatic compaction, after a multi-tool-loop turn, after provider/model switch, after context-limit changes, or when status/usage disagree.

## Inputs
Typed token snapshot, freshness timestamp/turn, context window, reserve, compaction history, minimum reclaim ratio.

## Outputs
`allow`, `defer`, or `block`; accepted occupancy; source field; reasons; warnings; required post-compaction checks.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/117511
- https://github.com/openclaw/openclaw/issues/118772
- https://github.com/openclaw/openclaw/issues/118678
- https://github.com/NousResearch/hermes-agent/issues/80449
- https://github.com/openclaw/openclaw/issues/15006
- https://github.com/openclaw/openclaw/issues/13853
