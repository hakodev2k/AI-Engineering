# Evaluation and Benchmarking

## Purpose
Build and run evaluation suites that measure the capabilities, limitations, robustness, and operational trade-offs relevant to an AI research claim.

## When to use
Use when validating a new model or training method, comparing checkpoints, introducing a benchmark, preparing a research report, or investigating disagreement between offline scores and observed behavior.

## Inputs
- Research hypothesis
- Models or methods to compare
- Benchmark datasets
- Task-specific metrics
- Inference configuration
- Known failure slices
- Cost and latency constraints when relevant

## Preconditions
Define what capability the benchmark is intended to measure and what decision the result will support. Keep final test material isolated from iterative prompt, model, and hyperparameter tuning.

## Context to inspect
Inspect benchmark provenance, contamination risk, metric implementation, prompt templates, few-shot examples, decoding settings, tool access, context limits, judge models, human-label protocols, and version history. Check whether benchmark saturation makes small gains meaningless.

## Core knowledge
Benchmarks are measurement instruments, not ground truth. Valid evaluation requires construct validity, reproducible inference, uncertainty estimates, and meaningful slices. For generative models, exact-match metrics may miss semantic quality while model-as-judge methods can introduce bias, position effects, self-preference, or prompt sensitivity.

## Procedure
1. Define the capability construct and expected failure modes.
2. Select multiple complementary benchmarks when no single metric captures the goal.
3. Validate data provenance and contamination risks.
4. Freeze benchmark versions and evaluation scripts.
5. Standardize prompts, context, decoding, tools, and inference budgets.
6. Add deterministic metrics where they correctly represent the task.
7. Add human or model-based judgments only with explicit rubrics and calibration.
8. Define important slices such as domain, language, difficulty, length, safety class, or temporal recency.
9. Run baseline sanity checks and known reference systems.
10. Measure variance due to seeds, sampling, judges, or repeated trials where relevant.
11. Track quality alongside latency, tokens, memory, and cost when the research claim has operational consequences.
12. Inspect examples from both wins and losses instead of relying only on aggregate metrics.
13. Report uncertainty and practical significance.
14. Freeze final results and preserve raw predictions for audit.

## Decision points
- Prefer task-native metrics when they correlate strongly with the desired behavior.
- Use model judges for scalable semantic evaluation only after validating them against human judgments on representative samples.
- Use pairwise evaluation when absolute scoring is poorly calibrated.
- Retire or downweight saturated, contaminated, or low-discrimination benchmarks.

## Common failure patterns
- Tuning prompts directly on the final benchmark.
- Changing decoding parameters between methods.
- Reporting only favorable benchmarks.
- Treating model-judge output as objective truth.
- Ignoring benchmark version changes.
- Using aggregate scores that hide severe slice regressions.
- Claiming improvement when the difference is smaller than evaluation variance.

## Verification
Evaluation is implemented when all systems can be scored through a frozen harness. It is verified when benchmark versions, inference settings, metrics, raw outputs, uncertainty, and slices are reproducible and when manual inspection supports the quantitative interpretation.

## Expected output
A versioned evaluation suite, raw predictions, metric and slice reports, uncertainty analysis, operational measurements, and a concise interpretation tied to the research hypothesis.

## Stop conditions
Stop when benchmark provenance is invalid, test contamination is discovered, judge reliability is inadequate, evaluation configurations differ materially across methods, or measurement variance overwhelms the effect being claimed.