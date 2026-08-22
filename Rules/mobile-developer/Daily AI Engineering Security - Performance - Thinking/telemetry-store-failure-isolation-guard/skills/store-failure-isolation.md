# Skill: Telemetry Store Failure Isolation

## Purpose
Measure and isolate non-critical telemetry-store failures so they cannot consume the entire runtime startup budget or repeatedly block availability.

## Trigger
Slow startup, SQLite timeout/corruption, abnormal telemetry DB/WAL size, repeated identical startup failure, or expensive retention/checkpoint work.

## Inputs
Store inventory with criticality, startup timing events, DB/WAL file sizes, optional integrity results, configured latency/size/retry budgets.

## Preconditions
Core state and telemetry stores can be identified separately. Health checks are read-only unless a human-approved recovery stage is reached.

## Required context
Startup deadline, which stores contain durable user state, acceptable fail-open policy for diagnostics, recovery/backup policy.

## Allowed tools
Read-only filesystem metadata, SQLite immutable/read-only probes, startup trace parsing, `scripts/store_health_guard.py`, benchmark tooling.

## Constraints
Do not delete or rotate a store classified as critical. Do not assume a large file is corrupt. Do not assume a corrupt non-critical store is safe to mutate while processes still hold it open. Preserve evidence before rotation.

## Procedure
1. Measure baseline startup latency and per-store initialization/maintenance time.
2. Inventory DB and WAL sizes; classify stores as critical or non-critical.
3. Run bounded health checks for telemetry stores separately from core state.
4. Fingerprint failures by store, error class, size bucket, integrity status, and startup phase.
5. If a non-critical store exceeds its budget or is known corrupt, open a fail-open circuit for runtime startup and defer/disable telemetry maintenance.
6. Preserve the failing telemetry files or metadata before any recovery mutation.
7. Recover by bounded rotate/rebuild only when all writer processes are stopped and policy allows it.
8. Measure startup again with telemetry isolated/rebuilt.
9. Verify core-state integrity and user-data inventory are unchanged.
10. Close the circuit only after the telemetry store passes health and startup budgets.

## Decision points
- Critical store unhealthy: block startup or enter dedicated recovery mode; never fail open.
- Non-critical store unhealthy/over-budget: allow degraded startup if core state is healthy.
- Same deterministic fingerprint repeats twice: stop automatic restart loop and require recovery path.
- WAL/DB merely large but healthy and within budget: do not rotate solely by size.

## Expected output
Before/after metrics, store classification, failure fingerprint, fail-open decision, recovery evidence, verification status.

## Metrics
Startup p50/p95, per-store init ms, WAL/DB bytes, WAL bytes per failed startup, identical retry count, fail-open count, core-state integrity, recovery success.

## Verification
Success requires improved startup latency/availability, telemetry failure isolated, core-state integrity unchanged, and no silent data loss in critical stores.

## Failure handling
Maximum two recovery attempts for a telemetry store. If health remains bad, keep telemetry circuit open and preserve evidence; escalate instead of restarting indefinitely.

## Stop conditions
Core-state health is uncertain, writer processes remain active during proposed rotation, backup/evidence preservation fails, or two recovery attempts fail.