# Segmentation and Clustering

## Purpose
Discover useful population structure and turn unsupervised patterns into stable, interpretable segments that support decisions.

## When to use
Use when meaningful groups are unknown and segmentation has a concrete downstream use.

## Inputs
Population, candidate variables, business objective, scaling choices, and downstream actions.

## Context to inspect
Feature semantics, skew, missingness, categorical variables, sampling, temporal stability, and actionable constraints.

## Core knowledge
Clusters are induced by representation, distance, algorithm, and hyperparameters; they are not automatically natural truths. Stability and actionability matter more than attractive visual separation.

## Procedure
1. Define what decisions segments should support.
2. Select variables available and meaningful for that decision.
3. Transform and scale according to feature semantics.
4. Establish simple rule-based segmentation as a baseline.
5. Compare justified clustering approaches.
6. Evaluate compactness, separation, stability, and size without relying on one index.
7. Profile clusters using variables not used to construct them.
8. Test stability across samples and time.
9. Name segments only after evidence supports interpretation.
10. Define assignment logic for new observations.

## Decision points
Use density methods for irregular shapes/noise, hierarchical methods for nested exploration, and centroid methods when compact numeric groups fit the use case.

## Common failure patterns
Choosing cluster count from aesthetics, mixing incompatible scales, interpreting artifacts as personas, and creating segments no team can act on.

## Verification
Repeat clustering across seeds/samples, test temporal stability, and validate usefulness with domain stakeholders.

## Expected output
Stable segment definitions, profiles, assignment method, limitations, and intended actions.

## Stop conditions
Stop when segments are unstable, non-actionable, or primarily encode prohibited/sensitive attributes without justified governance.