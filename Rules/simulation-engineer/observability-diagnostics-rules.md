# Observability and Diagnostics Rules
## Purpose
Make failed or suspicious simulation runs diagnosable from evidence.
## Scope
Logs, metrics, solver diagnostics, checkpoints, traces, and run metadata.
## MUST
- Emit run identity, configuration identity, solver status, termination reason, and material warnings.
- Record diagnostics sufficient to distinguish numerical failure from infrastructure failure.
- Preserve failure evidence before automatic cleanup when practical.
## MUST NOT
- classify a run successful when convergence or integrity criteria failed.
- log secrets or restricted source data unnecessarily.
## SHOULD
- Expose progress and health metrics for long-running campaigns.
## Exceptions
Telemetry reduction for performance must retain minimum failure diagnostics.
## Verification
Inspect failed-run artifacts, dashboards, logs, termination codes, and diagnostic completeness tests.