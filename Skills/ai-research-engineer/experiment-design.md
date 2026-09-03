# Experiment Design

## Purpose
Design AI experiments that isolate causal effects, use resources efficiently, and produce evidence strong enough to support technical decisions.

## When to use
Use before training runs, architecture comparisons, data interventions, optimizer changes, inference-policy experiments, or any research claim that depends on controlled comparison.

## Inputs
- Hypothesis
- Baseline configuration
- Candidate interventions
- Dataset and splits
- Evaluation metrics
- Compute budget
- Known sources of variance

## Preconditions
The research question must be falsifiable. A baseline must be runnable, and the primary metric must be defined before results are inspected.

## Context to inspect
Review prior experiment logs, seed variance, dataset leakage risks, checkpoint-selection rules, early-stopping policy, hardware differences, preprocessing, training duration, inference settings, and available observability.

## Core knowledge
Good experimental design controls confounders, predefines metrics, distinguishes exploratory from confirmatory work, and allocates replication where stochastic variance matters. Large AI experiments are expensive, so staged experiments should remove weak ideas early without biasing final claims.

## Procedure
1. Restate the hypothesis and expected mechanism.
2. Identify the minimal intervention that tests it.
3. List variables that must remain fixed.
4. Define treatment and control configurations.
5. Predefine primary, secondary, and guardrail metrics.
6. Choose evaluation slices before seeing results.
7. Estimate expected variance using historical evidence or pilot runs.
8. Choose seeds or repetitions appropriate to effect size and cost.
9. Define checkpoint-selection and stopping rules.
10. Decide which measurements are collected during training and after completion.
11. Add sanity checks that should fail if the intervention is inactive.
12. Run a small pilot to catch implementation or instrumentation errors.
13. Freeze the confirmatory configuration after pilot corrections.
14. Execute treatment and control under comparable infrastructure conditions.
15. Record code revision, config, data revision, environment, hardware, and artifacts.
16. Analyze both aggregate and slice-level effects.
17. Compare observed behavior with the predicted mechanism, not only the headline score.

## Decision points
- Use paired comparisons when examples or checkpoints can be matched directly.
- Increase repetitions when stochastic variance is comparable to the expected gain.
- Prefer smaller pilots for implementation validation, but do not generalize scaling conclusions from them without evidence.
- Separate exploratory tuning from final evaluation to avoid adaptive overfitting.

## Common failure patterns
- Changing multiple factors in treatment and control.
- Selecting metrics after results are visible.
- Reporting the best seed only.
- Using test data for iterative tuning.
- Ignoring failed runs that are part of the method’s operational reliability.
- Treating checkpoint selection as neutral when one method receives more opportunities.
- Running expensive experiments before validating the pipeline on a small scale.

## Verification
The experiment is implemented when configurations and instrumentation execute successfully. It is verified when treatment and control differ only in intended variables, the evaluation protocol was frozen before confirmatory results, run metadata is complete, and the observed effect exceeds uncertainty and practical significance thresholds.

## Expected output
A reproducible experiment specification, recorded run set, measurement table, uncertainty analysis, mechanism-oriented interpretation, and decision recommendation.

## Stop conditions
Stop when data leakage is discovered, instrumentation is invalid, the intervention is not actually applied, baseline reproduction fails, compute conditions are materially incomparable, or a safety constraint is violated.