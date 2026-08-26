# Experiment Tracking

## Purpose
Turn experimentation into attributable engineering evidence rather than undocumented trial-and-error.

## Scope
Runs, parameters, metrics, artifacts, comparisons, and experiment metadata.

## MUST
- Material experiments MUST record objective, inputs, parameters, metrics, artifacts, code identity, and owner.
- Metric definitions and evaluation datasets MUST be versioned or otherwise immutable for valid comparisons.
- Promotion decisions MUST link to the runs that support them.

## MUST NOT
- Results from incomparable datasets or metric definitions MUST NOT be presented as direct improvements.
- Failed or unfavorable runs MUST NOT be selectively hidden when they materially affect a conclusion.

## SHOULD
- Experiment systems SHOULD support lineage queries and structured comparison across runs.

## Exceptions
Exploratory work may use lighter tracking, but any result used for a production decision must meet full traceability requirements.

## Verification
Inspect experiment records, metric definitions, artifact links, lineage, comparison reports, and promotion records.