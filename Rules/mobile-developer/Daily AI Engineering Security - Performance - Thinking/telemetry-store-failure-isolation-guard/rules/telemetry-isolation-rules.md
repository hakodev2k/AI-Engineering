# Telemetry Store Isolation Rules

- Every local store MUST be classified as critical or non-critical before startup recovery logic runs.
- Conversation/thread/auth/permission durable state MUST NOT be treated as disposable telemetry.
- Non-critical telemetry failure MUST NOT block core runtime startup when core state is verified healthy and degraded operation is supported.
- Startup MUST record a per-store time budget and MUST NOT hide telemetry maintenance inside a generic global timeout.
- Retention, vacuum, checkpoint, reindex, or integrity work that can exceed the startup budget SHOULD run after core service readiness.
- Corruption and slowness MUST be distinguished; file size alone MUST NOT be labeled corruption.
- Repeated identical deterministic failures MUST be fingerprinted. Automatic restart MUST stop after two identical failed attempts.
- Recovery MUST preserve diagnostic evidence before rotation/rebuild.
- Rotation/rebuild MUST NOT run while known writer processes hold the SQLite store open.
- Critical stores MUST NOT be deleted, rotated, or failed open by this package.
- Fail-open mode MUST be observable and MUST identify the disabled/degraded telemetry capability.
- Core-state integrity MUST be checked before and after telemetry recovery.
- Recovery MUST NOT weaken permissions, sandboxing, authentication, or user-data durability.
- Performance improvements MUST be demonstrated by before/after measurements.
- A recovery attempt MUST NOT be called Verified until startup latency, telemetry health, and core-state integrity have all been checked.