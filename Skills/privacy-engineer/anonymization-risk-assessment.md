# Anonymization Risk Assessment

## Purpose
Evaluate whether released or retained datasets can reasonably be linked back to individuals despite removal of obvious identifiers.

## When to use
Use before public release, broad internal sharing, research exports, aggregate reporting, or claims that data is anonymous.

## Inputs
Dataset, release context, recipient model, auxiliary information assumptions, transformations, and utility requirements.

## Context to inspect
Inspect rare combinations, free text, timestamps, geography, longitudinal patterns, small groups, and external datasets.

## Core knowledge
Removing names is insufficient. Re-identification risk depends on uniqueness, linkability, inference, attacker knowledge, and release context. Privacy and utility trade off.

## Procedure
1. Define attacker and release model.
2. Identify direct and quasi-identifiers.
3. Measure uniqueness and small-cell exposure.
4. Test plausible linkage combinations.
5. Assess attribute inference risk.
6. Apply generalization, suppression, aggregation, perturbation, or stronger techniques as appropriate.
7. Re-measure risk and utility.
8. Document residual assumptions and controls.

## Decision points
Prefer controlled-access pseudonymous data when useful anonymization would destroy required utility.

## Common failure patterns
Assuming hashing equals anonymity, ignoring auxiliary data, releasing exact timestamps, and using one risk threshold for every context.

## Verification
Perform adversarial linkage tests and independent review for consequential releases.

## Expected output
A defensible risk assessment with transformations and residual risk.

## Stop conditions
Do not claim anonymity when reasonable re-identification paths remain unresolved.