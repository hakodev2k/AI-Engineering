# Guardrail Evaluation Dataset Design

## Purpose
Build representative datasets for normal, boundary, adversarial, and changing behavior.

## When to use
Use before control selection, policy/model changes, tuning, and regression investigation.

## Inputs
Taxonomy, production characteristics, incidents, abuse cases, languages, segments, metrics.

## Context to inspect
Inspect errors, rare high-impact cases, shifts, privacy constraints.

## Core knowledge
Datasets need benign negatives, ambiguity, adversarial transformations, multi-turn context, and production slices.

## Procedure
1. Define evaluation questions.
2. Sample representative traffic safely.
3. Add incident/expert attacks.
4. Add boundary/multilingual/encoded/multi-turn cases.
5. Define annotation/adjudication.
6. Split tuning/validation/holdout.
7. Track provenance/version.
8. Maintain stable/rotating suites.
9. Measure coverage.
10. Refresh on shifts.

## Decision points
Use synthetic expansion plus human/production evidence.

## Common failure patterns
Only positives, leakage, unrealistic balance, stale labels, duplicates.

## Verification
Audit agreement, coverage, leakage, provenance, shadow correlation.

## Expected output
Versioned corpus and coverage report.

## Stop conditions
Stop decisions on contaminated/unrepresentative data.