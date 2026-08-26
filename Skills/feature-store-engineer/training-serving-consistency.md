# Training-Serving Consistency

## Purpose
Detect and prevent skew between feature values used to train models and those supplied during production inference.

## When to use
Use before model launch, after feature changes, or when online model quality degrades unexpectedly.

## Inputs
Training dataset, online samples, transformation definitions, timestamps and serving logs.

## Context to inspect
Offline and online implementations, serialization, defaults, materialization, stream logic and model input adapters.

## Core knowledge
Skew arises from duplicated transformations, temporal mismatch, differing defaults, precision/encoding changes and stale online data. Shared definitions reduce but do not eliminate operational skew.

## Procedure
1. Enumerate model features and exact training definitions.
2. Trace each feature to online retrieval.
3. Align samples by entity and prediction timestamp.
4. Compare presence, type, timestamp and value.
5. Separate expected temporal differences from defects.
6. Quantify mismatch by feature and segment.
7. Trace mismatches to transformation, transport or freshness layers.
8. Fix the authoritative definition rather than patching model adapters.
9. Add parity checks to release gates.
10. Monitor skew continuously for critical features.

## Decision points
Exact equality is appropriate for deterministic discrete features; numeric tolerance may be appropriate for floating-point implementations if model impact is negligible.

## Common failure patterns
Different default values, duplicated SQL and service code, timezone drift, stale caches and comparing samples without temporal alignment.

## Verification
Demonstrate parity on representative production-like samples and regression tests for discovered skew modes.

## Expected output
A quantified skew report, corrected implementation and ongoing parity guardrail.

## Stop conditions
Stop if training provenance or online prediction timestamps cannot be reconstructed reliably.