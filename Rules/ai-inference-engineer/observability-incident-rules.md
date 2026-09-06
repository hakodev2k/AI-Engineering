# Observability and Incident Rules

## Purpose
Provide evidence to detect, diagnose, and mitigate inference failures and regressions.

## Scope
Metrics, logs, traces, model metadata, alerts, incident response, and post-incident actions.

## MUST
- Telemetry MUST identify model version, runtime version, serving pool, and hardware class where relevant.
- Metrics MUST cover latency, throughput, queueing, errors, saturation, memory pressure, and model-loading health.
- Alerts MUST map to actionable conditions and accountable ownership.
- Production conclusions MUST use available logs, metrics, traces, and deployment evidence rather than agent confidence.
- Significant incidents MUST document impact, timeline, mitigation, root cause or bounded causal evidence, and corrective actions.

## MUST NOT
- MUST NOT log secrets, authentication tokens, or raw sensitive prompts/responses without explicit authorization.
- MUST NOT delete evidence required for active investigation.
- MUST NOT claim root cause solely from temporal correlation.

## SHOULD
- Annotate dashboards with model, runtime, scheduler, and infrastructure changes.
- Add regression checks for confirmed failure modes.

## Exceptions
Telemetry reduction requires privacy or cost rationale plus alternative diagnostic evidence.

## Verification
Inspect dashboards, alerts, log redaction, traces, incident records, and corrective-test coverage.