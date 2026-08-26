# Streaming Data Quality

## Purpose
Detect, contain, and correct invalid or semantically inconsistent events before they contaminate downstream systems.

## When to use
Use for new pipelines, contract changes, quality incidents, and critical data products.

## Inputs
Schema, business invariants, completeness/freshness expectations, producer ownership, historical baselines.

## Context to inspect
Validation points, null/range distributions, duplicate rates, late data, DLQ/quarantine, lineage.

## Core knowledge
Schema validity does not prove semantic quality. Streaming quality needs continuous checks for validity, completeness, uniqueness, freshness, consistency, and distribution drift.

## Procedure
1. Define measurable quality dimensions and thresholds.
2. Validate structural contracts at boundaries.
3. Encode critical business invariants.
4. Measure duplicates, missing keys, freshness, and lateness.
5. Detect distribution anomalies where useful.
6. Quarantine invalid records with secure diagnostics.
7. Assign producer/data-owner remediation paths.
8. Reconcile corrected records safely.

## Decision points
Reject records that cannot be interpreted safely; quarantine recoverable data; tolerate deviations only when explicitly within product contract.

## Common failure patterns
Silent null coercion; dropping bad events; quality rules without owners; alerts with no baseline; fixing consumers instead of bad producers.

## Verification
Known-bad fixtures trigger controls, healthy fixtures pass, and quality metrics reconcile with source expectations.

## Expected output
Quality contract, checks, thresholds, quarantine path, and ownership.

## Stop conditions
Stop if authoritative business invariants or data ownership are unknown.