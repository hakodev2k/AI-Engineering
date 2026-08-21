# Data Observability

## Purpose
Detect and diagnose data-system failures through freshness, volume, quality, lineage, runtime, and dependency signals.

## When to use
Use for production pipelines and data products whose failures can silently deliver stale or incorrect data.

## Inputs
SLAs, pipeline metadata, dataset contracts, quality checks, lineage, runtime metrics, and incident history.

## Context to inspect
Inspect scheduler status, source arrival patterns, dataset freshness, row/byte volume, schema changes, quality metrics, consumer dependencies, and alert routing.

## Core knowledge
Infrastructure health does not imply data health. Observability must connect pipeline execution to the state and trustworthiness of produced datasets.

## Procedure
1. Define user-facing freshness and correctness objectives.
2. Instrument run duration, success, lag, and throughput.
3. Measure dataset freshness and expected volume.
4. Surface schema and quality failures.
5. Capture lineage from sources through transformations to consumers.
6. Correlate incidents across dependencies.
7. Create alerts tied to actionable ownership.
8. Build dashboards around service objectives, not metric abundance.
9. Add runbooks for common failure modes.
10. Review alert precision after incidents.

## Decision points
Page on urgent consumer-impacting failures; ticket or dashboard lower-severity trends. Use anomaly detection where fixed thresholds cannot model normal variation reliably.

## Common failure patterns
Monitoring only job success, alerting on every retry, missing consumer impact, dashboards without ownership, and no distinction between stale and incorrect data.

## Verification
Simulate late input, failed transformation, schema drift, and quality regression; confirm signals identify affected datasets and owners quickly.

## Expected output
An observability layer that exposes data health, dependency impact, and actionable incident context.

## Stop conditions
Escalate when critical lineage or ownership metadata is unavailable or monitoring cannot access required telemetry safely.