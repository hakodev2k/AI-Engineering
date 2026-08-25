# Async Checkpoint Read/Write Contention Profiler

**Category:** Performance

## Problem
An async checkpoint-history iterator can hold a coarse saver lock across `yield`, coupling active checkpoint writes to the speed of an unrelated history consumer. LangGraph issue #8558 currently reproduces this with `AsyncSqliteSaver.alist()` blocking `aput()` while iteration is paused. Separate concurrent-write issue #8136 shows that database-level writer contention also exists, so diagnosis must distinguish the layers.

## Evidence
See `evidence/research.md` for current public signals, official SQLite/aiosqlite mechanics, and LangGraph's backend guidance.

## Existing approach
Saver-level serialization protects one connection; SQLite WAL/busy timeouts address database-level concurrency; callers can consume history promptly; production workloads can migrate to Postgres.

## Existing limitations
A framework lock retained across consumer-controlled suspension can dominate writer latency before SQLite is reached. WAL cannot shorten that application critical section, consumer discipline is fragile, and migration to Postgres is disproportionate for some embedded/local workflows.

## Proposed improvement
Measure lock scope and writer wait explicitly. Move consumer pacing outside the shared critical section by materializing or snapshotting required results under lock and yielding after release, or use another bounded design justified by correctness. Never claim an improvement until matched before/after traces and history-equivalence checks pass.

## Architecture
The profiler consumes five simple lifecycle events. Rules define measurable constraints; the workflow forces baseline-first optimization; an independent investigator verifies causality and correctness.

## Actual package tree
```text
async-checkpoint-read-write-contention-profiler/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── contention-regression-gate.md
├── rules/
│   └── checkpoint-concurrency.rules.md
├── scripts/
│   └── async_lock_profiler.py
├── skills/
│   └── checkpoint-contention-analysis.md
├── subagents/
│   └── performance-investigator.md
├── tests/
│   └── test_async_lock_profiler.py
└── workflows/
    └── measure-diagnose-optimize-verify.md
```

## Installation
Python 3.9+ only; no third-party dependency is required by the profiler. Your application/framework instrumentation must emit JSONL events around the real saver operations.

## Configuration
Each event requires `ts_ms`, `event`, and `op_id`. Supported events are `lock_acquire`, `lock_release`, `yield`, `writer_wait_start`, and `writer_wait_end`. Use a monotonic timestamp source. Establish thresholds from the baseline or service objective before evaluating the candidate.

## Usage
Profile without thresholds:

```bash
python scripts/async_lock_profiler.py --input baseline.jsonl
```

Run a regression gate:

```bash
python scripts/async_lock_profiler.py --input candidate.jsonl \
  --max-writer-wait-ms 100 \
  --max-lock-hold-ms 100 \
  --max-yields-while-locked 0
```

Run tests:

```bash
python -m unittest tests/test_async_lock_profiler.py
```

## Workflow
Measure baseline → diagnose layer → form one hypothesis → implement → measure same workload → bounded re-diagnosis if needed → independent verification. Maximum two candidate implementations per run.

## Metrics
p95/max writer wait, p95/max lock hold, locks/yields under lock, checkpoint throughput, SQLite lock errors, and checkpoint-history equivalence.

## Verification
**Implemented** means the candidate lock/iterator change exists. **Measured** means matched baseline/candidate traces and correctness results exist. **Verified** means deterministic tests pass, configured budgets pass, no guarded history yield occurs under the lock, history results remain equivalent, and the independent Performance Investigator confirms the attribution.

## Safety and correctness
Do not improve latency by dropping history, weakening durability, silently reducing consistency, or only extending timeouts. WAL/busy-timeout tuning is appropriate only when traces show database-layer contention rather than framework-lock head-of-line blocking.

## Failure handling
Detection: profiler violation, invalid trace, history mismatch, or benchmark regression. Evidence: raw traces plus JSON metrics and correctness oracle. Retry: one re-diagnosis/reimplementation after the first candidate. Maximum two candidates. Fallback: revert and retain baseline. Escalation: checkpoint/runtime owner. Stop condition: causal layer cannot be measured or correctness cannot be preserved.

## Definition of Done
Evidence documented; baseline captured; root cause classified; candidate implemented; matched metrics collected; history equivalence passes; regression tests pass; independent verification passes; no blocking correctness/performance issue remains.

## Customization
Add backend-specific events or thresholds without changing the invariant that consumer-controlled async suspension must not silently extend a shared critical section and that performance claims require matched measurement.
