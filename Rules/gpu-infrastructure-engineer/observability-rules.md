# GPU Infrastructure Observability Rules

## Purpose
Provide evidence needed to diagnose accelerator availability, utilization, performance, and infrastructure failures.

## Scope
Applies to metrics, logs, traces, events, dashboards, alerts, and correlation across GPU hosts and supporting systems.

## MUST
- Observability MUST cover device health, utilization, memory, temperature, power, link state, host resources, scheduler state, network, and storage dependencies relevant to workloads.
- Telemetry MUST include stable identifiers sufficient to correlate job, node, accelerator, hardware generation, and failure domain without exposing secrets.
- Alerts MUST be tied to actionable conditions with documented ownership and response expectations.
- Diagnostic conclusions about production GPU incidents MUST cite available telemetry or clearly state missing evidence.
- Telemetry pipelines MUST be monitored for gaps and stale data.

## MUST NOT
- Dashboard appearance MUST NOT be treated as proof of system health when required telemetry is absent.
- High-cardinality labels MUST NOT be added without considering monitoring-system cost and stability.
- Logs and traces MUST NOT contain credentials, private keys, access tokens, or sensitive workload payloads.

## SHOULD
- Workload-level metrics SHOULD be correlated with infrastructure metrics to distinguish application inefficiency from platform faults.
- Baselines SHOULD be maintained by accelerator generation and workload class.

## Exceptions
Exceptions require documented observability gaps, risk, compensating evidence, and an owner for remediation.

## Verification
Review telemetry schemas, dashboards, alert tests, cardinality, retention, identifier correlation, incident evidence, and monitoring-pipeline health.