# Experimental Design Rules
## Purpose
Make experiments capable of supporting valid decisions.
## Scope
A/B tests, controlled experiments, pilots, and interventions.
## MUST
- Define hypothesis, unit of randomization, primary metric, guardrails, sample-size rationale, stopping rule, and analysis plan before exposure.
- Account for interference, repeated measures, multiple testing, and novelty effects when relevant.
## MUST NOT
- Repeatedly inspect results and stop opportunistically without a valid sequential design.
- Change the primary hypothesis after observing outcomes without labeling the analysis exploratory.
## SHOULD
- Pre-register consequential experiments.
## Exceptions
Emergency experiments require documented risk controls and retrospective review.
## Verification
Inspect experiment specification, assignment logic, power analysis, timestamps, and analysis code.