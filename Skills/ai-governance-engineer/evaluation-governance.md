# Evaluation Governance

## Purpose
Ensure AI evaluations are decision-relevant, reproducible, resistant to gaming, and tied to release criteria.

## When to use
Use when defining evaluation standards, approving high-risk releases, comparing models, or investigating quality/safety regressions.

## Inputs
Use cases, risk scenarios, datasets, metrics, thresholds, model versions, evaluation harnesses, prior baselines.

## Procedure
1. Derive evaluation objectives from intended use and material risks.
2. Define representative scenarios and edge cases.
3. Separate development from independent acceptance evaluations where needed.
4. Select metrics that capture quality and harm, including subgroup analysis when relevant.
5. Predefine thresholds and decision rules.
6. Version prompts, models, datasets, tools, and harnesses.
7. Run evaluations with uncertainty estimates.
8. Investigate failures rather than averaging them away.
9. Require documented exceptions for unmet thresholds.
10. Monitor production signals against pre-release assumptions.

## Decision points
Use human evaluation when semantics or context cannot be captured reliably by automated metrics; use automated tests for scale and regression detection.

## Common failure patterns
Benchmark chasing, test-set leakage, moving thresholds after results, aggregate metrics hiding severe failures, irreproducible runs.

## Verification
Independent rerun reproduces material conclusions and release decisions trace to predefined criteria.

## Expected output
Evaluation plan, evidence package, results, threshold decision, exceptions, and monitoring linkage.

## Stop conditions
Stop if evaluation evidence is contaminated, irreproducible, or insufficient for the risk level.