# Research Evidence

## Topic
Telemetry Store Failure Isolation Guard

## Category
Performance

## Problem
A non-essential diagnostic/telemetry SQLite store can become large, slow, WAL-heavy, or corrupt, yet still sit on the critical startup path for an AI desktop/runtime service. The result can be deterministic startup timeouts, repeated expensive maintenance on every retry, opaque database errors, and total application unavailability even while the actual conversation/state database is healthy.

## Why it matters now
Recent Codex reports show both the large/slow and corrupt variants of the same architectural failure. In one case a multi-GB logs database caused SQLite pool/startup initialization to exceed the Desktop handshake deadline. In another, a corrupt B-tree caused repeated ~30-second handshake failures and regenerated roughly 1 GB of WAL work per launch. Moving only the diagnostic log database aside restored startup while thread/state databases remained intact.

## Affected users
Desktop coding-agent users, agent-platform teams with local SQLite telemetry, app-server/runtime maintainers, observability pipeline owners, and developers running long-lived or high-volume agent sessions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #27741 reports launch failure when `logs_2.sqlite` grew to roughly 4.5 GB with a ~1.08 GB WAL. Metadata/count queries took tens of seconds, app-server startup failed around 33 seconds, and moving only `logs_2.sqlite*` aside restored launch while state/session data remained untouched. https://github.com/openai/codex/issues/27741
2. OpenAI Codex issue #39015 reports a corrupt `logs_2.sqlite` B-tree causing deterministic startup failure. Other databases passed integrity checks, yet the non-essential log DB blocked the entire application. The failing launch regenerated about 274k WAL frames (~1.05 GB) and missed the 30-second handshake by about 2 seconds; replacing only the log DB reduced visible startup to about 1.7 seconds. https://github.com/openai/codex/issues/39015
3. The #27741 report links broader public evidence for unbounded logging/WAL growth (#26374, #24275, #17320, #22444), supporting that log-store pressure is recurring rather than a single corrupted-machine event.

### Interpretation
The primary engineering defect is failure-domain coupling: diagnostic storage is initialized and maintained as if it were required state, so slow/corrupt telemetry can consume startup budget or fail the entire service. Retry behavior then re-runs the same deterministic heavy work without changing the failure condition.

## Existing approaches
- SQLite retention and WAL checkpoint maintenance.
- Generic startup timeout/handshake watchdogs.
- Manual rotation/removal of the log DB as a recovery workaround.
- Integrity checks such as `PRAGMA quick_check`.

## Remaining limitations
- Maintenance can still run synchronously before the service is usable.
- Generic startup deadlines do not distinguish progress from non-essential work.
- Corrupt telemetry may be treated as fatal even when durable user state is healthy.
- Repeated restart loops can amplify disk/CPU work.
- Users may see a generic state-database error instead of the specific failing store and safe recovery option.

## Root-cause analysis
1. Critical and non-critical SQLite stores share one initialization success boundary.
2. Telemetry retention/checkpoint/integrity work lacks an independent time/resource budget.
3. No fail-open policy exists for diagnostic storage when core state is healthy.
4. Rotation/rebuild is not automatically triggered on known-corrupt/over-budget telemetry stores.
5. Retry loops lack a deterministic-failure fingerprint and circuit breaker.

## Improvement opportunity
Create a reusable failure-isolation package that classifies stores by criticality, measures startup budget per store, performs bounded read-only health checks, fingerprints repeated failures, opens a circuit for non-critical telemetry, rotates/rebuilds only with explicit safe conditions, and verifies that core state remains untouched.

## Relevant sources
- https://github.com/openai/codex/issues/27741
- https://github.com/openai/codex/issues/39015
- https://github.com/openai/codex/issues/26374
- https://github.com/openai/codex/issues/24275
- https://github.com/openai/codex/issues/17320

## Goal
Keep core agent startup available when telemetry/log storage is slow or corrupt, while preserving diagnostic evidence and preventing unbounded retry work.

## Metrics
- startup latency p50/p95
- per-store initialization latency
- telemetry maintenance duration
- log DB/WAL size
- retries per identical failure fingerprint
- fail-open activations
- core-state integrity pass rate
- WAL bytes written per failed startup
- successful recovery rate

## Trigger
Startup deadline breach, telemetry DB integrity error, telemetry maintenance budget exceedance, repeated identical store failure, or abnormal log/WAL growth.

## Inputs
Store inventory and criticality, size/WAL metadata, optional SQLite health results, startup timing events, retry fingerprints, configured budgets.

## Outputs
Health report, critical/non-critical classification, fail-open/continue/block decision, recovery plan, before/after benchmark.