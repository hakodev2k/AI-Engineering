# Train-Serve Skew

## Purpose
Identify and eliminate differences between training-time and serving-time data or transformations that cause production degradation.

## When to use
Use when offline metrics are strong but production quality is weak, after feature-pipeline changes, or before launching a new online model.

## Inputs
- Training feature pipeline
- Serving feature pipeline
- Sample entity IDs and timestamps
- Model artifact and preprocessing
- Production predictions

## Context to inspect
Inspect feature code, point-in-time joins, defaults, categorical mappings, normalization, precision, timezone handling, freshness, and missing-value behavior.

## Core knowledge
Train-serve skew may be structural, temporal, semantic, numerical, or freshness-related. Shared code reduces risk but does not guarantee point-in-time parity.

## Procedure
1. Select representative entities and historical inference timestamps.
2. Recompute features through both training and serving paths.
3. Compare values with explicit tolerances.
4. Trace mismatches to source, transformation, or timing differences.
5. Check preprocessing artifacts and category vocabularies.
6. Validate default and missing-value behavior.
7. Add parity tests to CI or pipeline validation.
8. Monitor production skew continuously for critical features.

## Decision points
Use shared transformation code where practical; use independently optimized paths only with strong parity tests. Apply tolerances only for understood numerical differences.

## Common failure patterns
- Different window boundaries.
- Offline backfills unavailable online.
- Stale online features.
- Training normalization fitted on different data.
- Timezone or precision mismatch.

## Verification
Verify feature and prediction parity on representative samples and edge cases, and prove parity tests fail on known skew injections.

## Expected output
A skew report, root cause, remediation, and automated parity checks.

## Stop conditions
Stop if source lineage or historical serving values cannot be reconstructed sufficiently to compare paths.