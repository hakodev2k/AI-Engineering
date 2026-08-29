# Evaluation Strategy Rules

## Purpose
Ensure AI product quality is measured against real product tasks before and after launch.

## Scope
Applies to offline evaluation, human evaluation, online experiments, acceptance gates, and regression programs.

## MUST
- Evaluation sets MUST represent production tasks, important user segments, and known failure cases.
- Metrics MUST map to product requirements and MUST include safety or quality guardrails where failure is costly.
- Baselines MUST be defined before claiming improvement.
- Evaluation methodology and thresholds MUST be versioned when used for release decisions.
- Human-evaluation rubrics MUST define observable criteria and adjudication for ambiguous cases.

## MUST NOT
- MUST NOT use a single aggregate score to hide severe failures in critical slices.
- MUST NOT tune repeatedly on a supposedly held-out evaluation set without treating it as contaminated.
- MUST NOT promote a model or prompt solely on anecdotal examples.

## SHOULD
- Evaluation SHOULD combine automated, human, and online evidence when each measures different risk.
- Longitudinal monitoring SHOULD detect degradation after launch.

## Exceptions
Exceptions require a documented reason, residual risk, decision owner, and compensating verification.

## Verification
Inspect evaluation datasets, slice definitions, scoring code, rubrics, baselines, thresholds, experiment reports, and regression history.