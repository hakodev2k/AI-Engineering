# Fleet Observability

## Purpose
Make device-fleet health diagnosable without overwhelming constrained devices, networks, or telemetry systems.

## When to use
Use for production monitoring, incident response, rollout safety, or unknown field failures.

## Inputs
Fleet size, device capabilities, SLOs, failure modes, telemetry budget, support workflows.

## Context to inspect
Logs, metrics, traces/correlation IDs, crash data, version distribution, connectivity and update status.

## Core knowledge
Fleet observability requires aggregation and cohort analysis. Device-level logs alone do not reveal systemic regressions; dimensions such as hardware revision, firmware, region and network are essential but must avoid uncontrolled cardinality.

## Procedure
1. Define fleet health indicators and actionable SLOs.
2. Instrument boot, connectivity, update, resource, sensor and command health.
3. Add stable correlation identifiers.
4. Bound log volume and protect sensitive data.
5. Aggregate by meaningful cohorts.
6. Detect version-specific and regional anomalies.
7. Provide on-demand diagnostics with expiry.
8. Link alerts to operational runbooks.

## Decision points
Use metrics for fleet trends, structured events for transitions, and temporary detailed logs for targeted diagnosis.

## Common failure patterns
Always-on debug logs, PII/secrets in telemetry, high-cardinality labels, no firmware dimension, and alerts without actions.

## Verification
Inject known failures and confirm detection, cohort isolation, diagnostic retrieval, and alert usefulness.

## Expected output
A cost-aware fleet observability model supporting diagnosis and rollout decisions.

## Stop conditions
Stop collection when privacy, bandwidth, or storage constraints are violated.