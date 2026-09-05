# Clock and Timestamp Rules

## Purpose
Make telemetry ordering, latency analysis, and correlation reliable across distributed systems.

## Scope
Event timestamps, monotonic clocks, wall clocks, clock synchronization, ingestion timestamps, and duration measurements.

## MUST
- Event time and ingestion time MUST be distinguishable when both are used.
- Durations MUST use monotonic time sources when wall-clock adjustments could corrupt measurement.
- Timestamp precision and timezone semantics MUST be defined and consistent.
- Systems relying on cross-host ordering MUST monitor clock synchronization health.

## MUST NOT
- MUST NOT infer exact distributed ordering from wall-clock timestamps alone when skew can change conclusions.
- MUST NOT mix local-time timestamps without timezone information into shared telemetry.
- MUST NOT compute latency from mismatched clock domains without validation.

## SHOULD
- Normalize shared timestamps to a common standard such as UTC.

## Exceptions
Require documented constraint, bounded analytical impact, and alternative ordering or correlation evidence.

## Verification
Inspect emitted timestamps, duration code, time-sync telemetry, schema definitions, and cross-host correlation tests.