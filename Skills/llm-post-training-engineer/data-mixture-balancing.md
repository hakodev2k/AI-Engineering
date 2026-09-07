# Data Mixture Balancing

## Purpose
Design and tune post-training data mixtures so high-priority behaviors improve without rare slices disappearing or one source dominating the model's behavior.

## When to use
Use when combining domains, languages, safety data, reasoning data, tool traces, conversations, or synthetic and human supervision. Revisit after adding a major data source or observing asymmetric regressions.

## Inputs
Dataset inventory, token/example counts, quality scores, target behavior priorities, baseline metrics, slice evaluations, and training budget.

## Preconditions
Sources are versioned and separable enough to measure their contribution.

## Context to inspect
Review source size, duplication, quality, difficulty, target distribution, sampling implementation, token lengths, synthetic provenance, and prior ablations.

## Core knowledge
Raw dataset size should not determine training influence by accident. Mixtures trade breadth, priority, quality, and forgetting. Example-level sampling and token-level contribution differ when sequence lengths vary. Oversampling rare data can make it learnable but may cause behavioral overexpression and memorization. The useful mixture is empirical and depends on the starting checkpoint.

## Procedure
1. Group data by behaviorally meaningful source and slice.
2. Compute both example counts and token contribution under the actual sampler.
3. Establish target and preservation baselines.
4. Remove low-quality and redundant data before adjusting weights.
5. Set initial weights from product priority, scarcity, and quality rather than volume alone.
6. Ensure rare critical slices receive enough repeated exposure to influence learning.
7. Run small controlled mixture ablations.
8. Measure target gains and regressions by source-relevant slice.
9. Inspect whether oversampled data creates style, refusal, verbosity, or domain bias.
10. Adjust weights incrementally and retain comparable training budgets.
11. Recalculate effective contribution after packing, filtering, and truncation.
12. Freeze and version the final sampling configuration.

## Decision points
Oversample rare, high-quality critical behavior when underlearning is evident; prefer adding diverse examples over repeated duplication when memorization appears. Stage training when objectives interfere strongly. Use curriculum ordering only when evidence shows an advantage over simpler randomized mixtures.

## Common failure patterns
Weighting by file size; ignoring token-length differences; allowing synthetic data to swamp human anchors; repeated rare examples causing memorization; changing several mixture dimensions at once; judging mixtures only by aggregate benchmarks.

## Verification
Verify effective sample/token proportions from actual training logs, run slice-level ablations, check duplicate exposure, and confirm the chosen mixture beats simpler baselines on a multi-objective scorecard.

## Expected output
A versioned mixture specification with sampling weights, effective token contributions, ablation evidence, trade-offs, and preservation results.

## Stop conditions
Stop if source quality is unknown, mixture effects cannot be isolated, critical regressions grow with additional weighting, or sampler behavior differs from the documented configuration.