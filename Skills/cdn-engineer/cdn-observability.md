# CDN Observability

## Purpose
Build telemetry that explains user experience, cache behavior, edge failures, origin impact, and security events across the delivery path.

## When to use
Use for CDN onboarding, SLO design, incident response, optimization, or provider comparison.

## Inputs
Logs, metrics, traces, SLOs, request IDs, cache statuses, origin telemetry, cost constraints.

## Context to inspect
Edge log fields, sampling, retention, real-time streams, dashboards, alerts, origin correlation, privacy controls.

## Core knowledge
CDN telemetry must distinguish edge, shield, and origin behavior. Aggregates hide POP, ASN, protocol, path, and cache-key problems.

## Procedure
1. Define user-facing SLIs: availability, latency, correctness.
2. Capture request ID, POP, cache status, protocol, status, bytes, timing, origin, and security action.
3. Correlate edge requests with origin traces where possible.
4. Build hit-ratio and origin-offload metrics by content class.
5. Segment latency/errors by region, ASN, protocol, and POP.
6. Create actionable alerts tied to SLO impact.
7. Control log sampling without losing rare critical failures.
8. Apply retention and privacy requirements.
9. Validate dashboards during synthetic failures.

## Decision points
Use real-time streaming for incident-critical signals and batch logs for deep analytics. Sample high-volume success traffic, not security or rare error evidence blindly.

## Common failure patterns
Global averages, missing cache status, no origin correlation, excessive cardinality, logging sensitive query strings, and alerts without user impact.

## Verification
Inject known requests and failures, trace them end-to-end, confirm dashboard segmentation, alert firing, and privacy filtering.

## Expected output
An observability schema, SLO dashboards, alert rules, retention policy, and correlation workflow.

## Stop conditions
Escalate when required telemetry would expose regulated data or provider limitations prevent reliable SLI measurement.