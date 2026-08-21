# Observability Signal Correlation Triage Workflow

## Trigger
An alert, production symptom, latency/error spike, failed request, or suspected regression requires evidence-backed triage.

## Entry conditions
The affected component and approximate symptom time are known, and at least one telemetry source is available.

## Inputs
Symptom, service/component, time window, identifiers, telemetry locations, repository/deployment context, and known constraints.

## Context
Use `config/triage.yaml`, `rules/safety-and-evidence.md`, `skills/correlate-signals.md`, and `schemas/triage-report.schema.json`.

## Stages
1. **Normalize** — Coordinator fixes timezone/window and records the symptom as a fact.
2. **Collect** — Signal Investigator gathers logs first and available metrics/traces/deployment/alert evidence.
3. **Redact** — Run `python3 scripts/redact-evidence.py <raw> <redacted>` before handoff.
4. **Correlate** — Investigator links signals by trace/request/deployment/component/time keys and creates ranked hypotheses.
5. **Checkpoint A** — If fewer than two independent sources are available, continue only as `investigating` or `blocked`; do not claim correlation.
6. **Verify** — Verification Agent challenges the leading hypothesis and runs the smallest safe, non-destructive check.
7. **Checkpoint B** — If verification requires an approval-listed action, set `needs-approval` and stop before execution.
8. **Validate report** — Run `python3 scripts/validate-report.py <report.json>`.
9. **Complete** — Mark `verified` only when validation passes and verification result is `passed`; otherwise retain the evidence-backed non-final status.

## Responsible agents
Collection/correlation: `subagents/signal-investigator.md`. Independent verification: `subagents/verification-agent.md`. Human incident owner owns approval and production action.

## Tools
Read-only observability/repository/deployment queries plus the two scripts in `scripts/`.

## Produced artifacts
A redacted evidence bundle and one JSON report satisfying `schemas/triage-report.schema.json`.

## Retry rules
Transient telemetry/tool failures: maximum 2 retries per operation, preserving query, timestamp, error, and prior partial result. Validation failures: fix the report once per distinct error, maximum 2 validation cycles. Permission errors, unsafe actions, and contradictory evidence are not retryable by escalation of privilege.

## Failure paths
- Telemetry unavailable after retries -> `blocked`, preserve errors and available evidence.
- Permission denied -> `blocked`, request least-privilege access from human owner.
- Conflicting signals -> widen context once; if unresolved, `correlated` or `investigating` with contradiction documented.
- Verification needs dangerous action -> `needs-approval` and stop.
- Verification fails -> lower confidence, preserve result, return to correlation once; no more than 2 hypothesis cycles.

## Stop conditions
Verified result, bounded retry exhaustion, approval boundary, insufficient evidence, or no hypothesis at/above configured confidence threshold after two cycles.

## Definition of Done
Time window is explicit; required telemetry inspected; evidence is source-attributed and redacted; hypotheses include contradictions; verification result is recorded; report validator exits 0; dangerous actions were not executed without approval; unresolved risks are documented.
