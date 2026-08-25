# Observability and SLOs

## Purpose
Make Kubernetes platform and workload health diagnosable through metrics, logs, traces, events, and SLO-driven alerts.
## When to use
Platform design, incident reduction, alert review, or new cluster onboarding.
## Inputs
SLOs, telemetry stack, cluster metrics, workload signals, incident history.
## Context to inspect
Control-plane/node metrics, kube-state metrics, logs, events, tracing, dashboards, alert rules, retention and cardinality.
## Core knowledge
Useful telemetry answers user impact, saturation, errors, and causality. Kubernetes events are transient; labels can explode metric cardinality; alerts should map to actionable symptoms.
## Procedure
1. Define service/platform SLIs. 2. Instrument control plane, nodes, workloads, and critical add-ons. 3. Centralize logs/events with correlation metadata. 4. Build golden-signal and capacity dashboards. 5. Alert on SLO burn and actionable saturation. 6. Validate telemetry during controlled failures. 7. Tune retention/cardinality/cost.
## Decision points
Prefer symptom/SLO alerts over low-level causes; retain high-cardinality telemetry only when diagnostic value justifies cost.
## Common failure patterns
Alerting on every pod restart, missing node pressure, unbounded labels, no event retention, dashboards without ownership, and telemetry failing with the cluster.
## Verification
Inject representative failures and prove detection, correlation, alert routing, and diagnosis within operational targets.
## Expected output
SLO-linked dashboards, alerts, telemetry coverage, and ownership.
## Stop conditions
Stop when SLOs or alert ownership are undefined; escalate telemetry gaps that prevent safe production operation.