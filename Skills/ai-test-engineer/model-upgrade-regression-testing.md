# Model Upgrade Regression Testing

## Purpose
Determine whether a model or provider upgrade is safe for production by comparing behavior, quality, cost, latency, safety, and compatibility against the current baseline.

## When to use
Use for new model versions, provider migrations, context-window changes, decoding changes, or hosted-model aliases that can change behavior.

## Inputs
Current and candidate model configurations, regression suite, traffic/task distribution, release thresholds, latency/cost data, and known model dependencies.

## Preconditions
The baseline configuration is reproducible and candidate access is stable enough for comparison.

## Context to inspect
Inspect prompts, tool schemas, structured-output expectations, safety layers, token budgets, rate limits, provider semantics, and production fallback logic.

## Core knowledge
Model upgrades are dependency upgrades with behavioral effects. Improvements on headline benchmarks do not guarantee application compatibility. Compare application-specific distributions and protected failure cases.

## Procedure
1. Pin baseline and candidate configurations.
2. Run identical deterministic and score-based suites.
3. Compare task quality by category and risk tier.
4. Test structured output and tool-call compatibility.
5. Compare refusal, safety, and grounding behavior.
6. Measure latency, token use, throughput, and cost.
7. Test context-length and truncation-sensitive cases.
8. Inspect regressions even when aggregate score improves.
9. Run shadow or canary validation where possible.
10. Define rollback criteria before broad release.

## Decision points
Adopt when application-specific benefits exceed regression and migration risk. Use routing or partial rollout when the candidate is superior only for certain task classes.

## Common failure patterns
Trusting vendor benchmarks, changing prompts during model comparison, ignoring tail latency, missing tokenizer/context differences, and upgrading aliases without regression evidence.

## Verification
Confirm protected suites pass, category regressions are reviewed, operational metrics meet thresholds, and rollback has been exercised or proven viable.

## Expected output
A model-upgrade decision report with comparative evidence, compatibility issues, rollout scope, and rollback gates.

## Stop conditions
Stop when the baseline cannot be reproduced, candidate version is unstable, or a severe protected regression remains unresolved.