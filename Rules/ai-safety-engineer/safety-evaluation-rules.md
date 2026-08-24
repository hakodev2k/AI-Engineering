# Safety Evaluation Rules

## Purpose
Require reproducible evidence that AI behavior satisfies defined safety objectives.

## Scope
Applies to pre-release, regression, comparative, and post-deployment safety evaluations.

## MUST
- Define evaluation objectives, datasets, metrics, thresholds, and pass/fail criteria before interpreting results.
- Include representative normal, edge, adversarial, and high-impact scenarios.
- Preserve model/configuration versions and evaluation artifacts sufficient for reproduction.
- Investigate threshold regressions before release.

## MUST NOT
- Select only favorable metrics or subsets after observing results.
- Claim safety from aggregate averages that hide severe tail failures.
- Reuse contaminated evaluation items as unbiased evidence without disclosure.

## SHOULD
- Report confidence intervals or uncertainty where sampling materially affects conclusions.
- Maintain stable regression suites plus rotating or held-out evaluations.

## Exceptions
Any waived evaluation requires documented reason, risk, compensating evidence, and accountable approval.

## Verification
Re-run sampled evaluations, inspect versioned inputs and outputs, validate threshold calculations, and compare against prior baselines in release review.
