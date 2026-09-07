# Content Safety Classification

## Purpose
Design semantic safety classification where deterministic rules are insufficient.

## When to use
Use for contextual categories across input/retrieval/output; never for authorization.

## Inputs
Taxonomy, labels, classifiers, thresholds, languages, traffic, harm asymmetry.

## Context to inspect
Inspect definitions, overlap, prevalence, calibration, fallback, enforcement.

## Core knowledge
Quality requires clear taxonomy, representative data, calibration, cost-sensitive metrics, and category-specific thresholds.

## Procedure
1. Define categories with boundary examples.
2. Build representative slices.
3. Compare candidates.
4. Calibrate thresholds.
5. Define uncertainty.
6. Route high-risk uncertainty safely.
7. Test multilingual/obfuscated/contextual cases.
8. Monitor drift.
9. Recalibrate after changes.
10. Maintain appeals where appropriate.

## Decision points
Use category/workflow thresholds; abstain for high-impact uncertainty.

## Common failure patterns
Single accuracy, benchmark-only data, no calibration, ignored base rates, no monitoring.

## Verification
Use confusion matrices, cost metrics, shadow validation.

## Expected output
Calibrated classifier policy and monitoring.

## Stop conditions
Stop without adequate critical-category evidence.