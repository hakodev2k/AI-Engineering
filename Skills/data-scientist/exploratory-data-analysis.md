# Exploratory Data Analysis

## Purpose
Build an evidence-based understanding of a dataset, its generating process, relationships, anomalies, and limitations before formal modeling.

## When to use
Use after initial quality checks and whenever a new dataset, cohort, or unexplained model behavior is introduced.

## Inputs
Validated data, data dictionary, business definitions, sampling context, and analytical question.

## Context to inspect
Population definition, collection period, units, selection mechanisms, key entities, and known interventions.

## Core knowledge
EDA is hypothesis generation, not proof. Multiple comparisons, selection bias, confounding, aggregation effects, and leakage can make visually compelling patterns misleading.

## Procedure
1. Confirm unit of observation and population.
2. Inspect univariate distributions and temporal coverage.
3. Segment important measures by meaningful cohorts.
4. Explore relationships using appropriate summaries and visualizations.
5. Investigate outliers rather than deleting them reflexively.
6. Examine missingness and sampling patterns.
7. Test temporal stability and seasonality.
8. Look for leakage and post-outcome variables.
9. Record hypotheses separately from established facts.
10. Convert findings into follow-up tests or modeling decisions.

## Decision points
Use transformations when they improve interpretability or model assumptions, not merely appearance. Prefer robust statistics for heavy-tailed or contaminated data.

## Common failure patterns
P-hacking, causal claims from correlations, untracked filtering, data snooping, ignoring cohort differences, and choosing features solely from full-dataset relationships.

## Verification
Ensure observations can be reproduced from code, filters are explicit, and important claims survive reasonable cohort and time-slice checks.

## Expected output
A reproducible analytical notebook or report containing validated observations, hypotheses, risks, and next actions.

## Stop conditions
Stop when data quality or population ambiguity makes exploration materially misleading.