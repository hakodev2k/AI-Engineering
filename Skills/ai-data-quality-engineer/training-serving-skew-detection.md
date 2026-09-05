# Training-Serving Skew Detection

## Purpose
Detect mismatches between training data and production inference inputs that cause offline-online performance gaps.

## When to use
Use when production quality drops despite stable offline metrics, after feature pipeline changes, or before major model releases.

## Inputs
Training dataset, serving inputs, feature definitions, transformation code, feature store metadata, model logs, timestamps.

## Preconditions
Comparable feature representations can be extracted from both training and serving paths.

## Context to inspect
Feature computation, defaults, normalization, categorical encoding, time windows, missing-value handling, schema versions, online caches.

## Core knowledge
Skew can arise from different code paths, delayed features, inconsistent defaults, stale caches, time-window differences, or silent type coercion. Matching feature names is not sufficient; values and semantics must match.

## Procedure
1. Identify features shared by training and serving.
2. Compare transformation logic and versions.
3. Replay historical serving examples through the training pipeline where possible.
4. Compare distributions and per-record feature values.
5. Inspect defaults, null handling, and time windows.
6. Check online freshness and cache behavior.
7. Quantify skew by feature and segment.
8. Consolidate or align feature computation paths.
9. Add online-offline parity tests.
10. Monitor skew after deployment.

## Decision points
Prefer shared feature definitions when operationally feasible. Accept intentional skew only when documented and validated against model behavior.

## Common failure patterns
Comparing aggregate distributions only, ignoring timestamp alignment, duplicating transformations in separate codebases, and overlooking defaults.

## Verification
Representative examples produce equivalent feature semantics and measured skew remains within defined tolerances.

## Expected output
A skew report, corrected feature logic, and automated parity checks.

## Stop conditions
Stop when training or serving feature lineage is unavailable or cannot be reconstructed reliably.