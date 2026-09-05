# Data Mixture Rules

## Purpose
Control how domains, languages, sources, and task types influence the trained model.

## Scope
Sampling weights, curriculum stages, up/down-sampling, source caps, and mixture revisions.

## MUST
- Every production training mixture MUST have versioned source weights and a rationale tied to target capabilities.
- Effective token contribution after filtering, deduplication, packing, and sampling MUST be measured rather than inferred from raw dataset size.
- High-risk or highly repeated sources MUST have explicit contribution limits.
- Mixture changes MUST be evaluated for capability regressions, safety effects, and representation shifts.
- Curriculum transitions MUST specify trigger conditions or fixed schedules before execution.

## MUST NOT
- MUST NOT allow a single source to dominate unintentionally because of resampling or duplication.
- MUST NOT change mixture weights mid-comparison while claiming other hyperparameters are controlled.
- MUST NOT use hidden manual adjustments that cannot be reconstructed.

## SHOULD
- Mixture design SHOULD use ablations or smaller proxy runs when the effect of a major source is uncertain.
- Sampling SHOULD account for data quality and marginal value, not volume alone.

## Exceptions
Exceptions require documented constraints, expected impact, monitoring, and approval for release-relevant runs.

## Verification
Inspect mixture manifests, realized token counts, sampler configuration, ablation evidence, training logs, and evaluation deltas by domain and language.