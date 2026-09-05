# Class Balance and Representativeness

## Purpose
Evaluate whether AI datasets represent the populations, classes, scenarios, and operating conditions the model must handle.

## When to use
Use during dataset design, before training, after source changes, or when subgroup performance diverges.

## Inputs
Dataset, target population definition, class labels, subgroup fields, sampling process, production traffic distribution.

## Preconditions
The intended deployment population and relevant segments are defined.

## Context to inspect
Source coverage, sampling rules, exclusions, historical shifts, rare-event frequency, model evaluation slices.

## Core knowledge
Balanced does not always mean representative. Oversampling can help optimization while distorting probability estimates. Rare but high-impact cases may deserve intentional overrepresentation.

## Procedure
1. Define expected deployment distribution.
2. Measure class and subgroup distributions.
3. Compare training, validation, test, and production populations.
4. Identify absent or underrepresented scenarios.
5. Quantify overlap between class imbalance and subgroup imbalance.
6. Decide whether to collect, reweight, resample, or synthesize data.
7. Preserve unbiased evaluation sets.
8. Document intentional distribution changes.
9. Evaluate model metrics by slice.
10. Monitor distribution after deployment.

## Decision points
Use reweighting when collection is expensive and support exists; collect real data when coverage gaps involve novel conditions; avoid synthetic data as a substitute for unknown real-world behavior.

## Common failure patterns
Forcing equal classes without task rationale, evaluating on resampled test sets, ignoring deployment prevalence, and hiding sparse subgroups in averages.

## Verification
Dataset distributions match documented strategy and evaluation confirms adequate coverage for critical slices.

## Expected output
A representativeness assessment and justified collection or sampling plan.

## Stop conditions
Stop when the deployment population cannot be defined or critical subgroup data cannot be measured responsibly.