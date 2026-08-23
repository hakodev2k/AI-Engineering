# Observability, Analytics, and MetricKit

## Purpose
Instrument an iOS application so engineers can diagnose reliability/performance while product analytics remains privacy-aware and semantically trustworthy.

## When to use
Use for production telemetry, feature launches, incident diagnosis, performance monitoring, or analytics redesign.

## Inputs
Operational questions, product events, privacy constraints, SLOs/thresholds, telemetry SDKs.

## Context to inspect
Logging, signposts, crash reporting, MetricKit ingestion, analytics schemas, identifiers, sampling, redaction.

## Core knowledge
Telemetry must answer predefined questions. Event names and dimensions are contracts. High-cardinality or sensitive fields increase cost/privacy risk. Client delivery can be delayed or duplicated.

## Procedure
1. Define decisions/diagnostics telemetry must support.
2. Separate operational telemetry from product analytics.
3. Define stable event/metric schemas and ownership.
4. Add structured logs/signposts around critical boundaries.
5. Collect crash/hang/performance diagnostics with release identity.
6. Redact secrets and minimize personal data.
7. Sample noisy events deliberately.
8. Handle offline buffering and duplicate delivery semantics.
9. Validate dashboards/alerts against known test events.
10. Periodically remove unused telemetry.

## Decision points
Prefer metrics for trends, logs for discrete context, and signposts/traces for latency decomposition.

## Common failure patterns
Logging payloads/tokens, schema drift, event spam, missing build dimensions, vanity alerts, and analytics that changes meaning silently.

## Verification
Generate controlled events/incidents and confirm end-to-end ingestion, redaction, dimensions, and alert behavior.

## Expected output
Documented telemetry contracts and verified signals for reliability, performance, and key product flows.

## Stop conditions
Stop when data collection lacks approved privacy purpose or telemetry vendor behavior cannot meet required controls.