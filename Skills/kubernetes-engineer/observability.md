# Kubernetes Observability

## Purpose
Build signals that explain cluster health, workload behavior, saturation, and request failures across Kubernetes layers.

## When to use
Platform design, production readiness, incident response, or monitoring gaps.

## Inputs
SLOs, architecture, critical workloads, existing telemetry, and operational ownership.

## Context to inspect
Metrics, logs, traces, events, audit logs, control-plane/node telemetry, dashboards, alerts, and retention.

## Core knowledge
Kubernetes incidents cross layers. Resource state alone is insufficient; correlate application signals with pods, nodes, controllers, networking, and control plane.

## Procedure
1. Define service and platform SLO signals.
2. Collect workload and cluster metrics.
3. Centralize structured logs with Kubernetes metadata.
4. Preserve events and audit signals where required.
5. Correlate traces to workload identity.
6. Build dashboards around symptoms and saturation.
7. Alert on actionable conditions, not raw noise.
8. Test telemetry during representative failures.

## Decision points
Retain high-cardinality telemetry only where diagnostic value justifies cost; prefer symptom alerts over implementation-detail alerts.

## Common failure patterns
Alert storms, missing node/control-plane context, unbounded labels, short retention, and dashboards without SLO relevance.

## Verification
Inject known failures and confirm operators can identify affected workload, layer, scope, and timeline.

## Expected output
Actionable telemetry, dashboards, alerts, and diagnostic conventions.

## Stop conditions
Escalate when required telemetry access or retention is prohibited.