# Stochastic Reliability Testing

## Purpose
Test AI reliability when outputs vary across repeated runs even under similar inputs.

## When to use
Use for model upgrades, prompt changes, agent workflows, structured outputs, tool selection, and any behavior with nondeterministic variance.

## Inputs
Representative test set, model and prompt versions, sampling parameters, acceptance criteria, historical failure modes, evaluation metrics.

## Preconditions
Tests can be repeated under controlled versions and meaningful outcome metrics exist.

## Context to inspect
Temperature/sampling configuration, model aliases, tool schemas, retrieval variability, concurrency effects, evaluation harness, seed support where available.

## Core knowledge
A single successful run does not prove reliability for stochastic systems. Senior validation estimates failure rates, tails, and conditional weaknesses across repeated trials and representative segments.

## Procedure
1. Define reliability claims as measurable probabilities or thresholds.
2. Build representative cases including edge and high-risk scenarios.
3. Pin relevant versions and configuration.
4. Repeat cases enough times to expose variance.
5. Segment outcomes by intent, length, language, model route, tool path, and other relevant dimensions.
6. Measure structural validity, task success, policy compliance, and tool correctness separately.
7. Compare candidate and baseline distributions.
8. Investigate rare but severe failures independently of average score.
9. Add discovered failures to regression suites.
10. Re-run after remediation.

## Decision points
Use deterministic assertions for schemas and authorization; use statistical thresholds for probabilistic quality. Increase trial count when failures are rare but high impact.

## Common failure patterns
One-shot tests, averaging away severe tail failures, mixing model versions, changing evaluation criteria mid-run, and treating evaluator noise as model behavior.

## Verification
Repeated test runs produce statistically stable conclusions and critical failure rates remain within defined tolerances.

## Expected output
A reliability test report with sample design, repeated-run results, segmentation, tail failures, comparison to baseline, and release decision.

## Stop conditions
Escalate when sample size, evaluator quality, or reproducibility is insufficient for the risk level.