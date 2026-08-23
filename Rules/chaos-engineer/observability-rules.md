# Chaos Observability Rules
## Purpose
Ensure experiments produce trustworthy evidence.
## Scope
Logs, metrics, traces, experiment markers, and dashboards.
## MUST
- Mark experiment start, scope, fault changes, aborts, and end in operational telemetry.
- Ensure steady-state and guardrail signals are available before execution.
- Correlate observations with experiment identity.
## MUST NOT
- Continue a high-risk experiment blind when critical telemetry fails.
- Log secrets while increasing diagnostics.
## SHOULD
- Provide a dedicated experiment dashboard for complex runs.
## Exceptions
Telemetry-failure experiments require independent safety signals.
## Verification
Review markers, dashboards, signal freshness, correlation, and evidence completeness.