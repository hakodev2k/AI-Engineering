# Evaluation and Benchmark Rules

## Purpose
Require rigorous evidence that synthetic data is fit for its intended purpose.

## Scope
Applies to quality evaluation, benchmark construction, acceptance testing, and comparisons among generator versions or methods.

## MUST
- Evaluate against predefined acceptance criteria tied to intended downstream use.
- Use held-out reference data or independent evidence where possible.
- Include utility, fidelity, privacy, validity, robustness, and subgroup metrics when relevant to risk.
- Compare against meaningful baselines such as real-data subsets, previous generator versions, or simpler synthesis methods.
- Preserve evaluation datasets, metric definitions, and configuration versions required to reproduce results.
- Investigate regressions even when a composite score improves.

## MUST NOT
- Tune generation repeatedly against a hidden benchmark and continue calling it independent.
- Report only favorable metrics or omit failed criteria without explanation.
- Treat one downstream model's performance as universal evidence of dataset quality.
- Change metric definitions between versions without making the comparison discontinuity explicit.

## SHOULD
- Separate development, validation, and final acceptance evaluation.
- Include stress tests for distribution shift and edge cases.
- Use confidence intervals or repeated runs when stochastic variation is material.

## Exceptions
Alternative evaluation designs require documented limitations, bias risks, and compensating evidence.

## Verification
Inspect evaluation manifests, benchmark provenance, metric code, baseline comparisons, repeated-run statistics, failed-test disposition, and reproducibility artifacts.