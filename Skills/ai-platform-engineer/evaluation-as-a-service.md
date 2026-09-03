# Evaluation as a Service

## Purpose
Provide reusable evaluation infrastructure so teams can measure AI behavior consistently before and after release without rebuilding runners, datasets, judges, and reporting pipelines.

## When to use
Use when multiple teams need regression testing, model comparison, prompt validation, or release gates for AI systems.

## Inputs
- Evaluation datasets
- Candidate system or model versions
- Task-specific metrics and rubrics
- Judge models or deterministic scorers
- Release thresholds

## Context to inspect
Inspect existing ad hoc evaluation scripts, dataset ownership, metric definitions, judge prompts, experiment tracking, release pipelines, and production incident regressions.

## Core knowledge
Evaluation infrastructure must distinguish data, runner, scorer, and report versions. LLM judges are useful but stochastic and bias-prone; critical metrics should use deterministic or human-grounded checks when possible. Evaluation results are meaningful only for representative datasets and explicitly defined thresholds.

## Procedure
1. Define a versioned evaluation job contract.
2. Support immutable dataset references.
3. Separate candidate execution from scoring.
4. Support deterministic, model-based, and human-review scorers.
5. Capture model, prompt, tool, and retrieval versions for every run.
6. Record seeds and sampling parameters when applicable.
7. Execute baselines and candidates on comparable inputs.
8. Calculate aggregate and slice-level metrics.
9. Surface statistically or operationally meaningful regressions.
10. Integrate thresholds with CI/CD where appropriate.
11. Persist artifacts and reports for auditability.
12. Monitor judge drift and scorer changes.

## Decision points
Use hard release gates for stable high-value metrics; use advisory signals for noisy or exploratory metrics. Human review is appropriate for ambiguous quality dimensions or high-impact changes.

## Common failure patterns
Unversioned datasets, changing judge prompts mid-comparison, optimizing only aggregate scores, data leakage, tiny nonrepresentative samples, and release gates based on unstable metrics.

## Verification
Verify reproducibility, dataset immutability, scorer versioning, baseline comparison, failure reporting, and CI integration with known-good and known-bad candidates.

## Expected output
A reusable evaluation service with versioned inputs, transparent scoring, historical reports, and optional release gates.

## Stop conditions
Stop when evaluation criteria are undefined, data is not representative enough for the decision, or sensitive evaluation data lacks approved handling controls.