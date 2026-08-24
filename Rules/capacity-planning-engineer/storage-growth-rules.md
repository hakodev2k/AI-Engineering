# Storage Growth Rules
## Purpose
Prevent exhaustion and unsafe storage expansion.
## Scope
Primary data, indexes, replicas, logs, backups, snapshots, and temporary storage.
## MUST
- Storage forecasts MUST include all material amplification factors, not only primary data.
- Time-to-exhaustion MUST account for provisioning lead time and safe operating thresholds.
- Retention changes MUST quantify capacity and recovery implications.
## MUST NOT
- MUST NOT count reclaimable space as immediately available without validating reclamation behavior.
- MUST NOT perform destructive cleanup in production without explicit human approval and recovery evidence.
## SHOULD
- Growth plans SHOULD separate durable growth from transient workspace demand.
## Exceptions
Emergency cleanup requires incident controls, approval, and audit trail.
## Verification
Inspect storage telemetry, retention configuration, backup footprint, and growth backtests.