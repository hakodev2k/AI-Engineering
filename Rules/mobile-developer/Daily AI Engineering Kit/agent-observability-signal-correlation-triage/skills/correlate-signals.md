# Correlate Observability Signals

## Purpose
Convert incident telemetry into a bounded, evidence-backed triage report.

## When to use
Use when an alert, production symptom, failed request, latency spike, error-rate change, or suspected regression needs correlation across logs, metrics, traces, deploys, and alerts.

## Inputs
- Symptom and affected service/component.
- Time window, defaulting to 30 minutes around the symptom.
- Available telemetry sources and repository/deployment context.
- Known request, trace, correlation, tenant, user, or deployment identifiers.

## Preconditions
- Read-only telemetry access is available.
- Raw evidence location is known.
- Production mutation is not required for initial triage.

## Allowed tools
Read-only log/metric/trace queries, repository search, deployment history, alert history, `scripts/redact-evidence.py`, and `scripts/validate-report.py`.

## Constraints
- Do not infer causality from temporal proximity alone.
- Never copy secrets or unrestricted customer payloads into the report.
- Preserve timestamps, source names, query filters, and identifiers needed to reproduce findings.
- Use at least two independent signal sources before marking a hypothesis correlated, unless the report is explicitly `blocked`.

## Process
1. Normalize the incident window and timezone.
2. Record the symptom as a fact, not a cause.
3. Identify high-value correlation keys: trace ID, request ID, deployment SHA, host/pod, route, dependency, tenant, or error code.
4. Query logs for the narrowest matching window and keys.
5. Query metrics for rate, error, latency, saturation, and dependency changes in the same window.
6. Query traces when available and map the slow/error span to service/dependency boundaries.
7. Compare deployment/config/feature-flag events in the window.
8. Build hypotheses with supporting and contradicting evidence.
9. Reject hypotheses that explain only one signal while conflicting with stronger evidence.
10. Rank remaining hypotheses by confidence and blast radius.
11. Define a non-destructive verification check for the leading hypothesis.
12. Run verification when safe; otherwise mark `needs-approval` or `blocked`.
13. Produce the JSON report matching `schemas/triage-report.schema.json` and validate it with `python3 scripts/validate-report.py <report>`.

## Expected output
A report containing status, time window, signals, hypotheses, verification result, risks, and recommended action.

## Verification
A successful triage is not merely data collection. The leading hypothesis must either pass a reproducible verification check or remain explicitly inconclusive/blocked.

## Failure handling
Retry a telemetry query at most twice for transient tool/network failures. Preserve the failed query and error. Do not retry permission errors; escalate them. If signals disagree, widen context once, then report contradiction rather than forcing a conclusion.

## Stop conditions
Stop when verification passes, required evidence is unavailable after bounded retries, a dangerous action is required, or no hypothesis exceeds the configured confidence threshold.
