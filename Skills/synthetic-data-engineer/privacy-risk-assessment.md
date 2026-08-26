# Privacy Risk Assessment

## Purpose
Assess whether synthetic data leaks, memorizes, or enables inference about sensitive source records.

## When to use
Before releasing or sharing synthetic data derived from sensitive datasets.

## Inputs
Source sensitivity classification, generator, synthetic output, threat model, access model, and privacy requirements.

## Context to inspect
Inspect training membership, quasi-identifiers, rare combinations, nearest neighbors, generator access, and release audience.

## Core knowledge
“Synthetic” does not mean anonymous. Memorization and attribute/membership inference remain possible.

## Procedure
1. Define adversary capabilities and protected information.
2. Remove unnecessary direct identifiers before modeling.
3. Measure nearest-neighbor similarity to source records.
4. Test rare/quasi-identifier combinations.
5. Run membership/attribute inference tests appropriate to the model.
6. Compare risk to approved baselines.
7. Apply privacy-preserving training or coarsening when needed.
8. Re-test after every generator change.
9. Document residual risk and access restrictions.

## Decision points
Use differential privacy when formal guarantees are required and utility trade-offs are acceptable; restrict access when residual risk remains material.

## Common failure patterns
Assuming no exact duplicate means safe; testing only identifiers; publishing rare rows; ignoring model access threats.

## Verification
Independent privacy tests meet approved thresholds and no prohibited sensitive replicas are present.

## Expected output
Threat model, test results, mitigations, and release recommendation.

## Stop conditions
Stop release on unacceptable leakage or when privacy requirements/authority are unresolved.