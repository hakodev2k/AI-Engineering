# Observability Rules

## Purpose
Provide evidence to distinguish edge, network, cache, and origin failures quickly.

## Scope
Applies to logs, metrics, traces, request identifiers, dashboards, retention, and diagnostic dimensions.

## MUST
- Critical delivery paths MUST expose request volume, status, latency, cache status, and origin outcome.
- Telemetry MUST support segmentation by hostname, route, region/POP, and relevant cache outcome without leaking sensitive data.
- Request correlation MUST cross edge and origin boundaries where feasible.
- Logging and metric retention MUST satisfy incident investigation needs.
- Alerting signals MUST have documented meaning and owner.

## MUST NOT
- MUST NOT log secrets, authorization tokens, session identifiers, or sensitive payloads without approved protection.
- MUST NOT infer origin health solely from edge aggregate status.
- MUST NOT create unbounded-cardinality telemetry dimensions.

## SHOULD
- Maintain dashboards for cache efficiency, origin offload, edge errors, TLS, and traffic anomalies.
- Sample high-volume logs deliberately and document sampling effects.
- Preserve raw evidence needed for root-cause analysis.

## Exceptions
Reduced telemetry requires documented cost/privacy rationale and alternative diagnostic evidence.

## Verification
Inspect schemas and dashboards; trace representative requests edge-to-origin; test alerts; review redaction, cardinality, sampling, retention, and incident usability.