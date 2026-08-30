# Slowly Changing Dimensions

## Purpose
Implement historical dimension behavior so analytical results remain correct when descriptive attributes change over time.

## When to use
Use when dimensions contain attributes whose historical values matter, such as customer segment, account owner, region, product classification, or organizational hierarchy.

## Inputs
Dimension source data, business history requirements, natural keys, effective timestamps, source change indicators, expected query semantics.

## Context to inspect
Existing dimension keys, downstream fact joins, source correction behavior, CDC availability, late-arriving data, and warehouse merge capabilities.

## Core knowledge
Type 1 overwrites history; Type 2 preserves versions with surrogate keys and validity ranges; Type 3 preserves limited prior state. Hybrid patterns may combine them. Type 2 correctness depends on non-overlapping validity windows and deterministic fact-to-dimension resolution.

## Procedure
1. Classify each tracked attribute by historical requirement.
2. Identify a stable business key.
3. Choose SCD behavior per attribute group.
4. For Type 2, define surrogate key, effective-from, effective-to, and current-row indicators.
5. Detect meaningful changes without false positives.
6. Close prior versions and insert new versions atomically where possible.
7. Handle late-arriving source changes and corrections.
8. Resolve fact foreign keys by event time.
9. Add overlap, gap, uniqueness, and current-row tests.
10. Validate historical reports across known changes.

## Decision points
Use Type 1 when only current truth matters. Use Type 2 when historical attribution matters. Avoid Type 2 for volatile attributes that would create useless row explosion.

## Common failure patterns
Overlapping validity windows, multiple current rows, facts joined to current instead of historical versions, timestamp boundary errors, and version churn caused by inconsequential source changes.

## Verification
Test known attribute transitions, late-arriving changes, boundary timestamps, uniqueness, and historical metric attribution.

## Expected output
A documented and tested SCD implementation with explicit temporal semantics.

## Stop conditions
Stop when source change timing is unreliable and historical attribution cannot be reconstructed defensibly.