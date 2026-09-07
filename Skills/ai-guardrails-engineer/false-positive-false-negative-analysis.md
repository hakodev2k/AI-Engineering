# False Positive and False Negative Analysis

## Purpose
Quantify and reduce safety and operational error costs.

## When to use
Use for classifier/policy tuning and miscalibration incidents.

## Inputs
Labels, decisions, categories, thresholds, impact, appeals, incidents.

## Context to inspect
Inspect prevalence, segments, languages, scores, actions, consequences.

## Core knowledge
Error costs are asymmetric/category-specific; aggregate accuracy hides severe rare failures and base rates matter.

## Procedure
1. Define error costs.
2. Compute precision/recall/FPR/FNR/calibration by slice.
3. Review severe errors.
4. Separate taxonomy/model error.
5. Analyze threshold/volume trade-offs.
6. Choose contextual thresholds.
7. Add abstain/review bands.
8. Test holdout/shadow.
9. Monitor appeals/proxies.
10. Feed improvements.

## Decision points
Favor recall for catastrophic misses; precision where blocking is costly and containment strong.

## Common failure patterns
Global F1, ignored prevalence, test tuning, disputed labels, no slices.

## Verification
Cost-weighted improvement without critical regression.

## Expected output
Calibrated thresholds and monitoring.

## Stop conditions
Resolve policy/label ambiguity first.