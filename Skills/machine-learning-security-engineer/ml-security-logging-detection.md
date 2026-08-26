# ML Security Logging and Detection

## Purpose
Design telemetry that detects compromise and abuse across data, training, registry, and inference layers without creating new sensitive-data leakage.

## When to use
Use when productionizing ML systems, building detections, investigating incidents, or reviewing observability coverage.

## Inputs
Threat model, architecture, identity events, registry logs, pipeline logs, inference metadata, data-access logs, retention requirements, and SIEM capabilities.

## Preconditions
Define sensitive fields that must not enter logs and identify response owners for alerts.

## Context to inspect
Inspect data mutations, privileged IAM events, training runs, artifact downloads/promotions, deployment changes, inference volumes, model-selection changes, and administrative actions.

## Core knowledge
Security telemetry should capture control-plane events and behavioral signals. Raw prompts/features may be sensitive and are often unnecessary. High-cardinality ML metadata can be expensive; retain identifiers that support correlation without indiscriminate payload logging.

## Procedure
1. Map high-priority threats to observable events.
2. Define stable identifiers for dataset, model, run, artifact, deployment, principal, and request.
3. Log privileged mutations and promotion decisions immutably where feasible.
4. Capture inference abuse signals such as query velocity, diversity, failures, and resource usage.
5. Redact or tokenize sensitive payload fields.
6. Correlate pipeline, IAM, registry, and deployment events.
7. Build detections for unauthorized mutation, unusual downloads, extraction-like probing, and policy bypass.
8. Tune thresholds against legitimate workloads.
9. Define alert severity and response playbooks.
10. Test detections using controlled simulations.
11. Review retention, access, and logging cost.

## Decision points
Log payload content only when necessary, authorized, and protected. Prefer metadata and derived security features for routine detection. Page only on signals with actionable urgency; route lower-confidence anomalies for investigation.

## Common failure patterns
No model/dataset version in logs; raw sensitive prompts everywhere; alerts without identity context; audit logs writable by the same compromised workload; detecting only application errors; no test of alert delivery.

## Verification
Generate representative security events and confirm ingestion, correlation, alerting, redaction, retention, and investigator access. Verify detections distinguish expected high-volume clients from suspicious patterns.

## Expected output
A threat-linked telemetry schema, tested detections, privacy controls, and response routing.

## Stop conditions
Stop when logging would violate data-handling policy, required audit sources are unavailable, or an alert has no accountable response owner.