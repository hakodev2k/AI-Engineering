# Research

## Topic
Context Compaction Attempt Budget Rearm Guard

## Category
Token

## Problem
Long tool-heavy agent turns can exhaust a fixed context-compression attempt counter even when each compaction succeeds and materially reduces prompt size. With pluggable context engines, the runtime may fail to recognize successful compaction because re-arm behavior depends on implementation-private state not guaranteed by the public engine contract. The next legitimate context spike then fails with a max-attempts error despite prior successful maintenance.

## Why it matters now
A Hermes Agent issue opened 2026-09-05 reports that the `hermes-lcm` plugin context engine consumes one compression attempt per successful compaction and never re-arms the budget, causing long turns to die after ten successful compactions. An earlier issue from 2026-07-27 reports the same general budget-accounting failure in the built-in in-place compression path: successful compressions consume the same per-turn attempt budget as failed/no-progress retries. Hermes documentation explicitly supports pluggable context engines, so correctness must not depend on private fields of the built-in compressor.

## Affected users
Developers running long tool-calling agents, teams using Hermes context-engine plugins, local-model users with smaller context windows, gateway operators, and platform builders implementing custom compaction engines.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #103355, opened 2026-09-05, reports that with `context.engine: lcm`, every successful compaction permanently consumes a compression attempt because the re-arm path depends on a private attribute only the built-in `ContextCompressor` sets.
2. Hermes Agent issue #72451, opened 2026-07-27, reports that successful in-place compression exhausts a shared per-turn attempt budget during long tool loops; successful maintenance compactions and failed retries consume the same counter.
3. Hermes Agent developer documentation describes `ContextEngine` as the public abstraction for pluggable context engines and states that engines implement shared context-management responsibilities, while plugin engines replace the built-in compressor.
4. Hermes Agent issue #102339, opened 2026-09-03, documents a separate compression hard-ceiling race in which timeout ownership can bypass a configured fallback chain, reinforcing that compression-control state needs explicit runtime contracts rather than implicit timing/private-state assumptions.

### Interpretation
The attempt counter is mixing two different concepts: failure retries and successful maintenance cycles. A successful compaction followed by a confirmed below-threshold model request should establish progress and re-arm the retry budget. The runtime should receive that progress through a public engine result contract, not inspect private implementation fields.

## Existing approaches
Hermes uses bounded compression attempts, context thresholds, built-in and plugin context engines, fallback routes, and post-compaction prompt-token observations. Bounded attempts correctly prevent infinite compression loops, but the accounting semantics are too coarse when successful maintenance compactions and failed/no-progress retries share the same budget.

## Remaining limitations
- Successful compactions can consume the same budget as failed attempts.
- Plugin engines may not know about private attributes used by core re-arm logic.
- A long turn can legitimately need many successful compactions without being in a failure loop.
- Re-arming without proof of progress would create an infinite-loop risk, so simply resetting the counter after every `compress()` call is unsafe.
- Different compression layers and fallback paths can make the state machine hard to observe.

## Root-cause analysis
1. Retry budget models attempt count rather than no-progress/failure count.
2. Progress detection is coupled to built-in implementation-private state.
3. The public context-engine interface does not expose a normalized compaction result containing before/after usage and threshold clearance.
4. Attempt re-arm is not tied to an independently observable successful model request below threshold.
5. Telemetry does not always distinguish successful maintenance compaction from failed/no-progress compression.

## Improvement opportunity
Add a reusable budget-state verifier and contract: every compaction emits a normalized result with before/after tokens, reclaimed tokens, and threshold-cleared status; successful below-threshold progress re-arms the failure budget; no-progress or failed attempts consume it; re-arm requires a measurable reduction plus a successful subsequent request. Deterministic trace analysis can detect budgets that never re-arm or re-arm without evidence.

## Relevant sources
- Hermes Agent issue #103355, 2026-09-05: https://github.com/NousResearch/hermes-agent/issues/103355
- Hermes Agent issue #72451, 2026-07-27: https://github.com/NousResearch/hermes-agent/issues/72451
- Hermes Agent issue #102339, 2026-09-03: https://github.com/NousResearch/hermes-agent/issues/102339
- Hermes Agent context engine plugin documentation: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/context-engine-plugin.md
- Hermes Agent context compression and caching documentation: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/context-compression-and-caching.md
