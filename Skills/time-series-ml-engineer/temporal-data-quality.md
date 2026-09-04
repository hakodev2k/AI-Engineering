# Temporal Data Quality

## Purpose
Assess and remediate data-quality defects that specifically corrupt time-series modeling, including gaps, duplicates, irregular sampling, clock drift, late arrival, revisions, and entity misalignment.

## When to use
Use during dataset onboarding, pipeline changes, model regressions, or unexplained forecast instability.

## Inputs
Timestamped source data, schema, ingestion metadata, expected cadence, entity keys, revision policy, and known operational outages.

## Context to inspect
Check timezone conversions, daylight-saving transitions, event-time versus processing-time fields, deduplication logic, backfills, resampling, and upstream aggregation.

## Core knowledge
Temporal defects are often systematic rather than random. Forward filling can invent information, interpolation can leak future values, and resampling can alter target semantics. Late-arriving observations and source revisions can make offline training unrealistically clean relative to production.

## Procedure
1. Establish canonical timestamp, timezone, entity key, and expected cadence.
2. Profile coverage by entity and time range.
3. Detect duplicate timestamps, out-of-order records, gaps, bursts, and impossible intervals.
4. Quantify missingness patterns by season, entity, and upstream source.
5. Compare event time with ingestion time to characterize lateness.
6. Identify revisions and determine whether historical values mutate.
7. Test aggregations for boundary and timezone errors.
8. Choose gap handling based on data-generating semantics.
9. Preserve missingness indicators when absence may be informative.
10. Reconstruct training data using only values that would have existed at historical decision times when feasible.
11. Add automated temporal quality checks to pipelines.
12. Re-profile after remediation.

## Decision points
- Interpolate only when the underlying process supports interpolation and future information is not used improperly.
- Use explicit missing values when absence carries information or imputation is unjustified.
- Reject or quarantine malformed periods when correction would create fabricated history.

## Common failure patterns
Silent timezone shifts, duplicate observations after joins, forward fill across entity boundaries, future-aware interpolation, ignoring late data, and treating revised historical data as if it were originally available.

## Verification
Verify expected cadence, uniqueness constraints, timezone boundaries, gap statistics, late-arrival distributions, and representative historical replay. Confirm quality tests fail on intentionally corrupted samples.

## Expected output
A temporal data-quality report plus deterministic remediation and pipeline validation rules.

## Stop conditions
Stop if timestamp provenance is unknown, corrections require unverifiable assumptions, or upstream mutation prevents reconstruction of trustworthy historical state.