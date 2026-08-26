# Adversarial Evaluation Design

## Purpose
Produce valid, repeatable evidence about AI security and safety robustness.

## Scope
Test objectives, datasets, attack suites, scoring, baselines, sampling, and result interpretation.

## MUST
- Define hypotheses, metrics, success thresholds, model versions, and evaluation conditions before drawing conclusions.
- Include representative benign baselines to measure false positives and utility regressions.
- Preserve raw results sufficient for independent review.

## MUST NOT
- Change scoring criteria after seeing results without documenting the change.
- Generalize beyond the tested population, model, configuration, or attack coverage.

## SHOULD
Use held-out cases, repeated trials, confidence intervals, and stratified analysis where variability matters.

## Exceptions
Exploratory testing may be informal, but findings promoted to decisions require a defined evaluation method.

## Verification
Review protocol, dataset provenance, run configuration, scoring implementation, raw outputs, and statistical summaries.