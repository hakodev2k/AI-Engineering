# Workflow: Isolate, Recover, Benchmark

## Trigger
Runtime startup breaches its deadline or fails during telemetry/log-store initialization or maintenance.

## Goal
Restore core runtime availability by isolating non-critical telemetry failures while preserving diagnostic evidence and critical user state.

## Inputs
Store inventory, criticality config, startup trace, DB/WAL metadata, health results, startup/maintenance budgets.

## Baseline
Record startup duration, failing phase/store, per-store init time where available, DB/WAL bytes, retry count/fingerprint, and core-state health.

## Stages
1. **Observe** — identify the exact failing store/phase and separate core state from telemetry.
2. **Measure baseline** — run deterministic health guard and capture startup metrics.
3. **Diagnose** — classify slow, corrupt, oversized-but-healthy, lock/contention, or unknown.
4. **Hypothesize** — determine whether non-critical telemetry can be bypassed safely.
5. **Isolate** — open a telemetry circuit; defer maintenance from the critical startup path.
6. **Measure** — start runtime in degraded telemetry mode and compare latency/availability.
7. **Recover** — after evidence preservation and writer quiescence, rotate/rebuild only the non-critical failing store when policy permits.
8. **Measure again** — benchmark startup and store health after recovery.
9. **Independent verification** — Recovery Verifier checks core-state integrity and regression evidence.
10. **Complete** — close telemetry circuit only when health/budget targets are met.

## Responsible agent
Performance investigator diagnoses and proposes isolation. Recovery implementation may perform approved non-critical rotation. Independent verifier performs final review.

## Tools
`scripts/store_health_guard.py`, SQLite read-only checks, filesystem metadata, startup traces, backup/rotation mechanism owned by the host application.

## Outputs
Baseline, failure classification, circuit decision, recovery evidence, before/after benchmark, verifier decision.

## Checkpoints
Before isolation: core store classification verified. Before rotation: evidence preserved and writers stopped. Before closing circuit: health/budget checks pass.

## Metrics
Startup p50/p95, per-store milliseconds, DB/WAL bytes, failed-startup WAL growth, retry count, fail-open activation, core-state integrity.

## Retry policy
Maximum two recovery attempts. Identical deterministic startup failures also cap at two before circuit-break/escalation.

## Stop conditions
Critical-state health uncertain, failing store classification unknown, active writers during proposed rotation, evidence backup failure, or two failed recovery attempts.

## Failure path
Keep telemetry disabled/degraded if supported; preserve store for diagnostics; keep core runtime available only when critical state is healthy. Otherwise enter recovery mode and escalate.

## Verification
No claim of improvement without before/after measurements. Verified requires independent confirmation that critical stores are unchanged and startup target is met or materially improved.

## Definition of Done
Evidence documented; baseline measured; failing store identified; criticality confirmed; isolation behavior implemented; restart loop bounded; recovery evidence preserved; post-state measured; critical state healthy; verifier passes; no blocking issue remains.