# Configuration and Memory Rules
## Purpose
Tune PostgreSQL configuration without creating workload-wide instability.
## Scope
Memory, workers, checkpoints, WAL, connection, planner, and runtime parameters.
## MUST
- Calculate aggregate memory exposure rather than evaluating per-session settings in isolation.
- Validate cluster-wide changes against representative concurrency and workload.
- Record changed parameters, rationale, expected effect, and rollback.
## MUST NOT
- Copy tuning values from another system without accounting for workload and hardware.
- Increase memory knobs until swapping or OOM becomes plausible.
## SHOULD
- Prefer targeted session/database/role settings when the requirement is localized.
## Exceptions
Emergency tuning requires bounded monitoring and immediate rollback criteria.
## Verification
Inspect pg_settings, host/container limits, workload concurrency, memory/I/O metrics, and regression tests.