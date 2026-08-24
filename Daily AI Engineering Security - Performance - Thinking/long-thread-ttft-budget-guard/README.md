# Long-Thread TTFT Budget Guard

**Category:** Performance

## Problem
Very large persisted agent threads can suffer extreme delay before the first model token, even before any tool I/O. This package measures that phase explicitly and gates further thread growth against evidence-derived latency/size budgets.

## Evidence
`evidence/research.md` cites current Codex reports from 2026-08-01 and 2026-08-16 plus OpenAI truncation/cache guidance.

## Existing approach and limitations
Automatic compaction, hard context limits, prompt caching, and manual new-thread creation are useful but reactive. They do not by themselves prove where latency is spent or establish a thread-size SLO.

## Proposed improvement
Measure serialized history size and TTFT per turn, derive warning/block thresholds from local benchmarks, and perform bounded compact/fork/archive/externalization experiments with explicit required-context verification.

## Architecture
- `evidence/research.md` — evidence, approaches, gap, root cause.
- `rules/latency-budget.md` — measurable performance invariants.
- `skills/ttft-investigation.md` — investigation procedure.
- `subagents/performance-verifier.md` — independent before/after verifier.
- `workflows/measure-migrate-verify.md` — bounded optimization flow.
- `hooks/pre-turn-budget.md` — pre-turn decision contract.
- `scripts/ttft_profiler.py` — dependency-free profiler/gate.
- `tests/test_ttft_profiler.py` — phase and budget regression tests.

## Installation
Python 3.9+. Pytest is needed only to run tests.

## Configuration
Benchmark representative workloads, choose `warn-bytes`, `block-bytes`, and `ttft-slo-ms`, and document why those thresholds match your host/model/network environment.

## Usage
Profile a trace: `python scripts/ttft_profiler.py profile --trace trace.jsonl`.
Gate a thread: `python scripts/ttft_profiler.py gate --snapshot snapshot.json --warn-bytes 20000000 --block-bytes 40000000 --ttft-slo-ms 10000`. Example numbers are illustrative; production thresholds must come from local evidence.

## Metrics
History bytes/tokens, prepare time where available, p50/p95/max TTFT, first-tool timing, compaction duration/failures, and quality regression rate.

## Verification
Run `python -m pytest -q tests/test_ttft_profiler.py`, then compare equivalent baseline/candidate workloads and run required-context checks after migration.

## Safety
Never drop required security rules, approvals, active goals, or task evidence merely to reduce latency. Keep the original thread recoverable during migration experiments.

## Failure handling
Maximum two migration experiments per incident. If neither restores the SLO, preserve traces and escalate instead of repeatedly compacting.

## Definition of Done
Implemented: phase telemetry and gate integrated. Measured: baseline and candidate profiles collected. Verified: p95 TTFT/SLO improves, required context remains intact, tests pass, and an independent verifier confirms the result.
