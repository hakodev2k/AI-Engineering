# Data Requirements and Coverage Design

## Purpose
Translate model, evaluation, or testing goals into explicit synthetic-data coverage requirements so generation targets meaningful gaps rather than arbitrary sample volume.

## When to use
Use before building a generator, expanding an existing synthetic corpus, or responding to production failures caused by missing scenarios.

## Inputs
Target task, schema, labels, production distributions, known failure modes, rare scenarios, subgroup definitions, acceptance criteria.

## Preconditions
The downstream consumer of the data is known and its decision boundary or expected behavior can be described.

## Context to inspect
Real dataset statistics, error-analysis reports, confusion matrices, product requirements, domain rules, edge-case inventories, safety and fairness risks.

## Core knowledge
Coverage is multidimensional. Senior synthetic-data design distinguishes frequency coverage, semantic coverage, combinatorial coverage, boundary coverage, subgroup coverage, and adversarial coverage. Perfectly matching the observed distribution can preserve blind spots.

## Procedure
1. Enumerate important features, labels, entities, events, and conditions.
2. Separate common, rare, boundary, and prohibited scenarios.
3. Identify intersections that are poorly represented in real data.
4. Map known model failures to missing or weak coverage.
5. Define minimum sample counts or confidence targets per scenario.
6. Decide which dimensions should mirror production and which should be deliberately oversampled.
7. Create a coverage matrix and prioritize high-risk gaps.
8. Define generation constraints for impossible combinations.
9. Reserve independent real-world data for validation.
10. Review coverage requirements with domain owners before large-scale generation.

## Decision points
Oversample rare but important events when the learning or evaluation objective requires them. Preserve realistic prevalence when estimating production performance or calibration.

## Common failure patterns
Counting rows instead of scenarios, ignoring feature intersections, generating impossible combinations, and oversampling rare cases without correcting evaluation interpretation.

## Verification
Measure achieved coverage against the matrix and verify that samples satisfy domain constraints and improve detection of targeted failures.

## Expected output
A prioritized coverage specification with scenario definitions, target counts, constraints, and validation evidence.

## Stop conditions
Stop when critical scenario definitions are ambiguous, domain constraints conflict, or no reliable way exists to validate synthetic coverage.