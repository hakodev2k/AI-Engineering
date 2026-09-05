# Data Freshness and Timeliness

## Purpose
Ensure AI pipelines receive data within the time windows required for correct training, evaluation, and inference behavior.

## When to use
Use for streaming or batch pipelines, delayed features, stale retrieval corpora, slow source feeds, or freshness-related model regressions.

## Inputs
Event timestamps, ingestion timestamps, processing timestamps, source SLAs, refresh schedules, consumer requirements.

## Preconditions
Relevant business time semantics and expected update cadence are known.

## Context to inspect
Source extraction, queues, batch schedules, watermarking, retries, backfills, feature materialization, caching, and serving paths.

## Core knowledge
Freshness measures age relative to consumer need; timeliness measures whether data arrives when expected. Event time and processing time must be distinguished, especially for late-arriving records.

## Procedure
1. Define freshness SLA per critical dataset or feature.
2. Capture event, arrival, and processing timestamps.
3. Measure end-to-end lag distributions.
4. Segment lag by source and pipeline stage.
5. Identify late, stuck, and out-of-order data.
6. Audit cache and materialization update behavior.
7. Define late-data and backfill handling.
8. Add freshness checks before consumption.
9. Create alerts on sustained SLA violations.
10. Test downstream behavior under stale-data scenarios.

## Decision points
Fail closed when stale data makes decisions unsafe; degrade gracefully when last-known-good data is acceptable and clearly bounded.

## Common failure patterns
Using only ingestion time, hiding delays behind averages, refreshing caches less often than source data, and treating late data as missing data.

## Verification
Measured lag stays within documented thresholds and simulated delays trigger expected safeguards.

## Expected output
Freshness SLAs, lag diagnostics, remediation, and monitoring rules.

## Stop conditions
Stop when source timestamp semantics or acceptable staleness cannot be established.