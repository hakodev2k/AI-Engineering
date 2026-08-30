# Measure → Diagnose → Compact → Verify Workflow

## Trigger
Automatic compaction threshold approached, token telemetry disagreement, provider/model switch, or repeated compaction.

## Goal
Compact only when current context occupancy is reliably measured and the operation produces measurable reclaim without unacceptable quality loss.

## Inputs
Typed token snapshot, budget config, compaction history, representative quality fixtures.

## Baseline
Record tokens/task, last-call prompt tokens, cumulative usage, current occupancy estimate, context window, compactions/task, latency, cost, and quality pass rate.

## Context
Use `evidence/research.md`, `skills/context-accounting-audit.md`, and `rules/compaction-integrity.md`.

## Stages
1. **Measure** — capture baseline and metric provenance.
2. **Diagnose** — identify whether pressure is real occupancy, cumulative accounting inflation, stale state, cache-accounting confusion, or a genuinely oversized protected tail.
3. **Hypothesize** — define one falsifiable correction.
4. **Gate** — run `scripts/context_accounting_gate.py` with the same snapshot and budget.
5. **Compact if allowed** — preserve protected correctness/safety state and record tokens before/after.
6. **Measure again** — calculate reclaim ratio, latency, cost, and quality.
7. **Verify** — independent Token Verifier replays the decision and checks regression evidence.

## Responsible agent
Implementation owner for stages 1–6; `subagents/token-verifier.md` for stage 7.

## Tools
Telemetry parser, tokenizer/estimator, deterministic gate, compactor under test, test runner.

## Outputs
Metric map, baseline, gate report, compaction record or defer decision, before/after comparison, verification decision.

## Checkpoints
C1 metric provenance complete; C2 trusted fresh occupancy selected; C3 threshold decision reproducible; C4 reclaim measured; C5 quality checked; C6 independent verification complete.

## Metrics
False-positive compactions; reclaim ratio; compactions/task; utilization; cost/task; p50/p95 latency; quality pass rate.

## Retry policy
At most 2 correction/remeasure cycles. A second low-reclaim compaction opens the circuit breaker.

## Stop conditions
No trusted occupancy; occupancy below threshold; no reclaimable context; circuit breaker open; quality regression above tolerance; or successful independent verification.

## Failure path
Disable destructive auto-compaction for the affected session/path, retain telemetry, use a bounded safe estimate or explicit human recovery, and investigate the producer of the bad metric.

## Verification
Run the unit tests and compare identical pre-change/post-change workloads. Do not claim improvement from a different workload.

## Definition of Done
Baseline exists; source semantics documented; gate passes; compaction decision is source-aware; before/after measurements complete; quality preserved; retries bounded; verifier approves; no blocking ambiguity remains.
