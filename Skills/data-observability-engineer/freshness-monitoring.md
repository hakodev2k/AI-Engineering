# Freshness Monitoring

## Purpose
Detect and diagnose data that arrives, updates, or becomes queryable later than consumers expect.

## When to use
Use for scheduled ingestion, CDC, streaming, warehouse models, reports, and APIs where stale data can cause incorrect decisions.

## Inputs
Expected cadence, event and ingestion timestamps, orchestration metadata, source availability, consumer deadlines, historical latency.

## Preconditions
Timestamp semantics must be understood. Do not assume maximum row timestamp equals successful dataset delivery.

## Context to inspect
Inspect source generation time, extraction time, ingestion time, transformation completion, publication time, partitions, retries, and timezone handling.

## Core knowledge
Freshness is an end-to-end property. Event time, processing time, and publication time answer different questions. Senior monitoring distinguishes source lateness, pipeline delay, partial partition arrival, and delayed publication.

## Procedure
1. Define the consumer-visible freshness boundary.
2. Identify timestamps representing each processing stage.
3. Measure expected cadence and normal variance.
4. Build lag metrics for critical stages.
5. Detect missing partitions or incomplete intervals.
6. Set dynamic or static thresholds based on workload behavior.
7. Correlate freshness breaches with orchestration and source telemetry.
8. Include dataset, partition, owner, and dependency context in alerts.
9. Test late, missing, and replayed input scenarios.
10. Tune alerts using incident outcomes.

## Decision points
Use fixed thresholds for deterministic schedules and adaptive baselines for variable arrivals. Alert on consumer-impacting publication delay rather than every intermediate delay unless intermediate signals materially improve response.

## Common failure patterns
- Using local time inconsistently
- Alerting on maximum timestamps when partitions are missing
- Treating source delay as pipeline failure
- Ignoring backfill behavior
- Thresholds tighter than normal operational variance

## Verification
Inject delayed and missing intervals, confirm the correct freshness state, and verify recovery clears only after complete data is published.

## Expected output
Freshness metrics, alert rules, diagnostic dimensions, and validated runbook links.

## Stop conditions
Stop if timestamp semantics or expected delivery commitments cannot be established from evidence.