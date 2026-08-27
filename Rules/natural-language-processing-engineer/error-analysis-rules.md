# Error Analysis Rules

## Purpose
Turn evaluation failures into bounded, evidence-based engineering decisions.

## Scope
Failure taxonomy, sampling, root-cause analysis, regression investigation, and corrective actions.

## MUST
- Material model regressions MUST be investigated with representative examples and a documented failure taxonomy.
- Error analysis MUST distinguish data, annotation, preprocessing, modeling, integration, and distribution-shift causes where evidence permits.
- Proposed fixes MUST identify which observed failure class they target and how success will be measured.
- Safety-critical errors MUST have explicit severity and escalation paths.

## MUST NOT
- MUST NOT generalize from a few handpicked examples to population-level conclusions.
- MUST NOT patch prompts, rules, or preprocessing broadly without checking collateral regressions.
- MUST NOT discard inconvenient failures as noise without evidence.

## SHOULD
- Samples SHOULD be stratified by important slices and confidence bands.
- Recurrent failure classes SHOULD become regression tests or evaluation slices.

## Exceptions
When root cause cannot be isolated, the uncertainty, bounded hypotheses, and next evidence required must be documented.

## Verification
Review sampled cases, taxonomy coverage, hypothesis logs, before/after slice metrics, regression fixtures, and links from corrective changes to observed failures.