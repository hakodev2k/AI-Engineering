# Event Time and Point-in-Time Correctness

## Purpose
Prevent training-serving leakage by ensuring every historical feature value reflects only information available at prediction time.

## When to use
Use for historical dataset generation, backfills, temporal joins and leakage investigations.

## Inputs
Observation timestamps, feature event timestamps, availability timestamps, source delay behavior and transformation history.

## Context to inspect
Timestamp columns, ingestion semantics, late-data handling, join SQL, snapshots, CDC logs and prior training datasets.

## Core knowledge
Event time describes when a fact occurred; processing/ingestion time describes when it arrived. Correct historical retrieval usually requires the latest eligible feature event whose availability does not exceed the observation cutoff.

## Procedure
1. Define the prediction timestamp precisely.
2. Identify event and availability timestamps for every source.
3. Quantify normal and worst-case source delay.
4. Specify temporal eligibility rules.
5. Implement as-of joins at the correct entity grain.
6. Exclude records unavailable at prediction time.
7. Handle late corrections according to reproducibility policy.
8. Build synthetic leakage tests with deliberately future records.
9. Compare generated rows against hand-computed examples.
10. Record temporal semantics in feature metadata.

## Decision points
Use availability time when event data can arrive materially late. Preserve original snapshots when exact experiment reproducibility outweighs retrospective correction.

## Common failure patterns
Joining on date only, using latest current values, confusing ingestion and event time, unbounded forward fill and applying corrected data retroactively.

## Verification
Run adversarial future-data tests, inspect boundary timestamps and reproduce known historical examples exactly.

## Expected output
A point-in-time-correct retrieval implementation with leakage tests.

## Stop conditions
Stop if timestamps lack trustworthy semantics or historical availability cannot be reconstructed.