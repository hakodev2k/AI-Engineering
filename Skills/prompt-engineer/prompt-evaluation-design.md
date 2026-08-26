# Prompt Evaluation Design

## Purpose
Build evaluations that measure whether a prompt works across realistic inputs rather than a handful of demos.

## When to use
Use before prompt release, after model/prompt changes, and when production failures reveal missing coverage.

## Inputs
Prompt contract, production samples, failure taxonomy, graders, baselines, and release thresholds.

## Context to inspect
Inspect existing eval sets, label quality, production distribution, historical regressions, and grader reliability.

## Core knowledge
Evaluation must separate dimensions such as correctness, faithfulness, safety, format, and style. Aggregate scores can hide catastrophic slices. LLM judges require calibration.

## Procedure
1. Derive metrics from acceptance criteria.
2. Build representative, boundary, adversarial, and historical-regression cases.
3. Define deterministic graders where possible.
4. Create rubrics for semantic judgments.
5. Calibrate model-based graders against human-labeled samples.
6. Define critical slices and minimum thresholds.
7. Compare candidate against current baseline.
8. Review failures qualitatively, not only numerically.
9. Add newly discovered failures to regression coverage.
10. Version datasets, rubrics, graders, prompts, and models together.

## Decision points
Use exact matching only when exactness is semantically required. Use human review for high-impact ambiguous judgments. Prefer paired comparisons when absolute scoring is unstable.

## Common failure patterns
Training on the eval set; tiny homogeneous samples; changing judge and candidate simultaneously; optimizing a single average; accepting judge explanations as ground truth.

## Verification
Re-run evals reproducibly, inspect slice-level results, calculate disagreement rates, and confirm release thresholds reflect business risk.

## Expected output
A versioned evaluation suite, rubric, baseline, thresholds, and failure report.

## Stop conditions
Stop if ground truth is undefined, graders are uncalibrated for a high-risk decision, or evaluation data materially differs from expected production traffic.