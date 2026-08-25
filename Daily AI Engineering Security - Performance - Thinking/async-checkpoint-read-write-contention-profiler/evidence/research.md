# Research — Async Checkpoint Read/Write Contention Profiler

## Topic
Async SQLite checkpoint history iteration holding application locks across consumer yields

## Category
Performance

## Problem
Async checkpoint stores can serialize writes behind slow history consumers when an async iterator holds a shared application-level lock across `yield`. In LangGraph's `AsyncSqliteSaver.alist()`, a current reproducible issue shows that once one checkpoint is yielded, the saver can retain `self.lock` until the consumer resumes or closes the iterator, blocking `aput()` and other operations using that lock.

## Why it matters now
This is a current, reproducible 2026 issue in a widely used agent persistence path. Durable agents may read checkpoint history for UI, debugging, replay, or inspection while active graph runs continue writing checkpoints. A paused consumer can therefore turn a local history read into unbounded write latency. A separate current LangGraph issue also reports `database is locked` under highly concurrent `AsyncSqliteSaver.aput()` calls, showing that SQLite checkpoint concurrency already has multiple pressure points.

## Affected users
- Developers using LangGraph `AsyncSqliteSaver` for local durable agents and small projects.
- Agent platforms exposing checkpoint/history inspection while runs remain active.
- Teams debugging latency or unexplained checkpoint stalls.
- Framework maintainers designing async iterator and saver locking boundaries.

## Current public evidence

### Observed evidence
1. LangGraph issue #8558, opened in August 2026, reproduces `AsyncSqliteSaver.alist()` retaining `self.lock` after yielding a checkpoint, causing `aput()` to time out while iteration is paused. It reproduces on `langgraph-checkpoint-sqlite==3.1.1` and then-current `main`. https://github.com/langchain-ai/langgraph/issues/8558
2. LangGraph issue #8136, opened in 2026, reports intermittent `sqlite3.OperationalError: database is locked` during 50 concurrent `AsyncSqliteSaver.aput()` operations and proposes earlier write-lock acquisition. https://github.com/langchain-ai/langgraph/issues/8136
3. LangGraph checkpoint documentation classifies `AsyncSqliteSaver` as suitable for async SQLite but not recommended for production; async Postgres is the recommended production path. https://langchain-ai.github.io/langgraph/reference/checkpoints/
4. aiosqlite documents that each connection uses one shared execution thread and request queue to prevent overlapping actions. https://aiosqlite.omnilib.dev/en/v0.20.0/
5. SQLite's isolation documentation states that writes are serialized and only one writer can proceed at a time; WAL permits readers and a writer concurrently, but there is still one writer at a time. https://www.sqlite.org/isolation.html and https://www.sqlite.org/wal.html

## Interpretation
The #8558 failure is an application-level critical-section problem, not simply a SQLite journal-mode problem. If a framework lock is held across an async `yield`, consumer pacing extends the lock lifetime. WAL or `busy_timeout` cannot eliminate that head-of-line blocking because the writer may be waiting for the framework lock before it reaches SQLite. The #8136 signal is distinct but reinforces the need to measure both application-lock wait and database-lock failures rather than treating all checkpoint latency as one cause.

## Existing approaches
- Serialize access with a saver-level async lock.
- Enable SQLite WAL or tune busy timeouts for database-level contention.
- Keep history iteration fast and fully consume/close iterators.
- Use `AsyncPostgresSaver` for production workloads requiring higher concurrency.
- Materialize query results before yielding, as proposed in #8558.

## Remaining limitations
- A single lock is simple and safe but can couple write latency to an arbitrary consumer pause.
- WAL improves read/write overlap at the SQLite layer but does not shorten a framework lock held across `yield`.
- Consumer discipline is fragile: a UI, debugger, network client, or cancelled task can pause unexpectedly.
- Migrating to Postgres is a heavier operational response for local and embedded agent runtimes.
- Generic request latency does not reveal whether time is spent waiting on the framework lock, SQLite, serialization, or consumer pacing.

## Root-cause analysis
1. The lifetime of a saver critical section extends beyond database work into consumer-controlled iteration time.
2. Async generator suspension transfers scheduling control while retaining the lock.
3. Read and write operations share a coarse lock even when the database can safely support more overlap.
4. Existing latency telemetry often lacks explicit lock-acquire/release and writer-wait events.
5. SQLite's own single-writer constraint can be misdiagnosed as the sole cause, hiding framework-level head-of-line blocking.

## Improvement opportunity
Instrument saver critical sections and writer wait time explicitly; reject regressions where reads yield while holding a shared lock; use a bounded materialize-then-yield or paged snapshot pattern so consumer pacing occurs outside the lock; and compare before/after traces before claiming an optimization.

## Proposed solution
This package provides a dependency-free JSONL lock/contention profiler, performance rules, a reusable diagnosis skill, independent investigator role, bounded optimization workflow, a CI-style regression hook, and deterministic tests. It is framework-agnostic: hosts can emit the five documented trace event types around any async checkpoint saver.

## Goal
Reduce writer wait caused by history consumers without weakening checkpoint consistency or silently dropping history.

## Metrics
- `max_writer_wait_ms` and `p95_writer_wait_ms`
- `max_lock_hold_ms` and `p95_lock_hold_ms`
- `locks_with_yield`
- `max_yields_while_locked`
- checkpoint operation throughput
- database-lock error count
- history result count/equality before and after

## Trigger
Run when checkpoint writes stall, history inspection overlaps active runs, saver locking changes, or a checkpoint backend/version is upgraded.

## Inputs
Timestamped JSONL trace events: `lock_acquire`, `lock_release`, `yield`, `writer_wait_start`, `writer_wait_end`, each with `ts_ms` and `op_id`.

## Outputs
JSON metrics, trace-integrity errors, threshold violations, and a blocking exit code for regressions.

## Verification
A change is verified only after the same workload is measured before and after, writer-wait/lock-hold metrics improve or remain inside explicit budgets, no read yields occur under the guarded shared lock, checkpoint history results remain equivalent, and regression tests pass.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8558
- https://github.com/langchain-ai/langgraph/issues/8136
- https://langchain-ai.github.io/langgraph/reference/checkpoints/
- https://aiosqlite.omnilib.dev/en/v0.20.0/
- https://www.sqlite.org/isolation.html
- https://www.sqlite.org/wal.html
