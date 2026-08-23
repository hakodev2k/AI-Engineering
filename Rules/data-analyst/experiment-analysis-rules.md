# Experiment Analysis Rules

## Purpose
Ensure experiment conclusions are valid, reproducible, and decision-ready.

## Scope
Controlled experiments, feature tests, and randomized trials used for product or operational decisions.

## MUST
- Verify assignment, exposure, sample-ratio, and eligibility logic before estimating effects.
- Predefine or clearly distinguish primary, secondary, and exploratory metrics.
- Analyze according to the intended unit of randomization.
- Report effect size, uncertainty, duration, and material guardrail outcomes.
- Investigate novelty, interference, attrition, and instrumentation changes when relevant.

## MUST NOT
- MUST NOT stop or segment experiments opportunistically to manufacture significance.
- MUST NOT discard adverse guardrail outcomes from the decision narrative.

## SHOULD
- Use pre-analysis plans for high-impact or high-cost experiments.

## Exceptions
Exploratory tests may use looser planning if all post-hoc choices are disclosed.

## Verification
Review experiment configuration, assignment balance, exposure logs, analysis code, metric definitions, and decision criteria.