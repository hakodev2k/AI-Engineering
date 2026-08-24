# SQL Observability Rules

## Purpose
Make database workload behavior diagnosable with trustworthy operational evidence.

## Scope
Query telemetry, waits, locks, errors, resource metrics, slow-query data, and correlation identifiers.

## MUST
- Critical SQL workloads MUST expose sufficient telemetry to distinguish latency, blocking, resource saturation, and failures.
- Diagnostic collection MUST protect sensitive query values and personal data.
- Production conclusions MUST be based on available logs, metrics, plans, waits, traces, or equivalent evidence.
- Monitoring changes MUST account for collection overhead and retention.

## MUST NOT
- MUST NOT enable high-overhead tracing indefinitely without capacity assessment.
- MUST NOT log credentials, tokens, or sensitive parameter values.
- MUST NOT infer root cause from a single metric when competing explanations remain plausible.

## SHOULD
- Correlate database activity with application requests/jobs where practical.
- Preserve baselines for critical workload indicators.

## Exceptions
Deep diagnostics during incidents may temporarily increase overhead only with bounded duration, monitoring, and authorized operational control.

## Verification
Inspect telemetry configuration and sample records, test correlation, validate redaction, measure collection overhead, and demonstrate that common failure modes can be distinguished from evidence.