# NLP Evaluation and Error Analysis

## Purpose
Build evaluation systems that reveal whether an NLP model is useful, robust, and improving for the cases that matter in production.

## When to use
Use for model selection, regression testing, launch gates, incident analysis, or post-launch quality review.

## Inputs
Task contract, benchmark data, model outputs, business error costs, production slices, human review rubric.

## Preconditions
Target behavior and unacceptable failures are defined.

## Context to inspect
Existing metrics, benchmark provenance, class/language/domain distributions, judge instructions, prior incidents, baseline outputs.

## Core knowledge
No single NLP metric captures semantic quality. Evaluation should combine task metrics, slice metrics, calibrated human judgments, adversarial cases, and production-oriented failure taxonomy.

## Procedure
1. Map each acceptance criterion to observable evidence.
2. Preserve a stable core benchmark and a rotating challenge set.
3. Separate model-selection data from final holdout data.
4. Choose task-appropriate metrics and confidence intervals.
5. Define critical slices by language, domain, length, rarity, and risk.
6. Build a failure taxonomy before reviewing examples.
7. Sample errors systematically, not only memorable failures.
8. Use human or model judges with calibrated rubrics when automatic metrics are insufficient.
9. Compare against baseline and previous release.
10. Turn recurring failures into regression tests.

## Decision points
Prefer exact automatic metrics for deterministic outputs; semantic/human evaluation for open generation. Use paired evaluation when small quality differences matter.

## Common failure patterns
Benchmark overfitting, test-set reuse during prompt tuning, averages hiding critical slices, uncalibrated LLM judges, and reporting improvements without uncertainty.

## Verification
Benchmarks are leakage-controlled, judge agreement is measured, critical slices meet gates, and error samples support metric conclusions.

## Expected output
Evaluation suite, scorecard, slice analysis, failure taxonomy, confidence estimates, and release recommendation.

## Stop conditions
Stop when evaluation data is contaminated or judges cannot reliably distinguish acceptable from unacceptable outputs.