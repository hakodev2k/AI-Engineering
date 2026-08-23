# Observability Rules
## Purpose
Provide enough telemetry to diagnose platform and workload health without guesswork.
## Scope
Metrics, logs, traces, events, dashboards, SLOs, and telemetry pipelines.
## MUST
- Monitor control-plane, node, networking, DNS, storage, scheduler, and workload health appropriate to the platform.
- Preserve correlation identifiers and timestamps needed to connect workload and infrastructure evidence.
- Define retention and access controls for operational telemetry.
- Use telemetry evidence before asserting production root cause.
## MUST NOT
- Depend on pod-local logs as the only production diagnostic record.
- Collect sensitive data indiscriminately in telemetry.
## SHOULD
- Standardize labels and dimensions that support service, cluster, namespace, node, and workload analysis.
## Exceptions
Reduced telemetry for low-risk environments must not compromise required security or incident evidence.
## Verification
Review dashboards, telemetry pipelines, retention settings, sample incident queries, and end-to-end signal availability.