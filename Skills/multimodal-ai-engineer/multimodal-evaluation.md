# Multimodal Evaluation

## Purpose
Build an evaluation system that measures semantic quality, cross-modal reasoning, grounding, robustness, latency, and cost without hiding failures behind one aggregate score.

## When to use
Use before model selection, release, fine-tuning, provider migration, or architecture changes.

## Inputs
Task specification, labeled examples, model candidates, production traces, failure taxonomy, business acceptance criteria.

## Preconditions
Define what constitutes success and which error classes are materially worse than others.

## Context to inspect
Inspect modality mix, annotation provenance, benchmark leakage, evaluator prompts, slice definitions, production distributions, and model/version metadata.

## Core knowledge
Multimodal quality is multidimensional. A system may answer correctly for the wrong visual evidence, perform well on clean images but fail on scans, or improve average accuracy while regressing a safety-critical slice. Automated judges are useful but require calibration against human labels.

## Procedure
1. Create a task and failure taxonomy.
2. Build representative examples for every supported modality combination.
3. Separate semantic, localization, extraction, safety, and latency metrics.
4. Add single-modality and missing-modality controls.
5. Define hard slices for quality, language, domain, and input length.
6. Establish human-labeled gold data.
7. Calibrate automated evaluators against the gold set.
8. Run candidate models with identical preprocessing.
9. Report confidence intervals where sampling permits.
10. Inspect regressions even when aggregate score improves.
11. Add cost and latency to the release decision.
12. Version datasets and evaluator configurations.

## Decision points
Use deterministic metrics for exact extraction and localization; human or calibrated model judges for open-ended semantics. Reject aggregate-only evaluation when high-impact slices exist.

## Common failure patterns
Benchmark contamination; inconsistent preprocessing; judging outputs without source media; uncalibrated LLM judges; ignoring abstentions; comparing different latency/cost envelopes as if equivalent.

## Verification
Reproduce scores from pinned artifacts, manually audit sampled results, and confirm evaluator agreement on high-impact cases.

## Expected output
A versioned multimodal evaluation suite with metrics, slices, gold labels, regression gates, and cost/latency evidence.

## Stop conditions
Stop when success criteria are undefined, evaluation data is contaminated, or automated judging cannot be calibrated for the required decision.