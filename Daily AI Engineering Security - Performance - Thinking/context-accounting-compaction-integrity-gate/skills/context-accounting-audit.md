# Context Accounting Audit Skill

## Purpose
Determine which token metric is safe to use for context-window and compaction decisions, then verify compaction with measured before/after evidence.

## Trigger
Before destructive compaction; after long tool loops; after model/provider/context-window changes; when session status, provider usage, and transcript estimates disagree.

## Inputs
Current prompt/token snapshot, per-call usage, cumulative usage, cache usage, context window, reserve budget, snapshot freshness, transcript estimate, compaction history.

## Preconditions
Metric producers and units are known. The audit MUST keep billing totals separate from occupancy metrics.

## Required context
Only token telemetry, session identifiers safe to log, model/provider limits, and representative quality fixtures.

## Allowed tools
Tokenizers/estimators, telemetry parsers, local benchmark scripts, test runners, read-only session logs with secrets redacted.

## Constraints
- Cumulative usage MUST NOT be assumed to equal current context occupancy.
- Cache billing fields MUST NOT be used for occupancy unless provider semantics explicitly prove they represent unique in-window tokens.
- Unknown/stale occupancy MUST block destructive automatic compaction.
- Context required for correctness MUST NOT be removed merely to satisfy a token target.

## Procedure
1. Enumerate each token field and assign semantic type: billing cumulative, last-call prompt, cache accounting, stored-context estimate, output, or window capacity.
2. Record source, producer, update timing, units, and freshness.
3. Establish baseline with representative tool-heavy sessions: tokens/task, compactions/task, p50/p95 latency, cost/task, quality.
4. Compare current occupancy candidates. Flag impossible values (`<0`, occupancy > window without overflow state, or cumulative/current ratio above configured sanity bound).
5. Select an accepted occupancy only from locally configured trusted sources.
6. Compute threshold pressure using accepted occupancy + reserve, not cumulative usage.
7. Before compaction, verify that reclaimable history exists and the previous compaction is not inside the circuit-breaker window.
8. If compaction runs, measure tokens before/after and reclaim ratio.
9. Rerun quality fixtures and compare regression tolerance.
10. Emit decision, evidence, source metric, and verification status.

## Decision points
- No fresh trusted occupancy → defer/block automatic compaction.
- Occupancy below threshold → do not compact.
- Occupancy above threshold but no reclaimable history → stop/escalate instead of looping.
- Reclaim ratio below minimum twice → open circuit breaker.
- Quality regression above tolerance → restore last known-good context strategy.

## Expected output
Facts, Metric map, Baseline, Hypothesis, Decision, Before/after metrics, Risks, Verification status.

## Metrics
False compaction rate; utilization; reclaim ratio; compaction calls/task; cost/task; latency; quality pass rate.

## Verification
Independent verifier replays stored snapshots through the deterministic gate and confirms identical decisions and acceptable quality.

## Failure handling
Maximum 2 remediation retries, each with a new evidence-backed hypothesis. Unknown metrics are not guessed.

## Stop conditions
Stop on reliable no-compaction decision, verified successful compaction, repeated low-reclaim circuit break, quality failure, or unresolved metric ambiguity.
