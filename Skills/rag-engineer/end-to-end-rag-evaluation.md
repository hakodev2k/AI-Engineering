# End-to-End RAG Evaluation

## Purpose
Evaluate whether the complete system produces useful, correct, grounded answers under realistic conditions.

## When to use
Use before releases, after model/retrieval changes, and for regression gates.

## Inputs
Evaluation dataset, deployed pipeline candidate, answer rubric, baseline, latency/cost telemetry.

## Context to inspect
Inspect retrieval traces, generated answers, citations, abstentions, model settings, tool failures, and production acceptance criteria.

## Core knowledge
End-to-end quality combines retrieval, context construction, generation, safety, latency, and cost. Automated judges can scale evaluation but require calibration against human judgments.

## Procedure
1. Define task-specific answer dimensions: correctness, completeness, grounding, citation quality, relevance, and abstention.
2. Run baseline and candidate under controlled settings.
3. Capture full traces and operational metrics.
4. Score deterministic properties automatically.
5. Use calibrated model-based evaluation for subjective dimensions where appropriate.
6. Human-review critical and disagreement samples.
7. Segment regressions by query class.
8. Compare quality gains against latency and cost.
9. Establish release thresholds and blocking regressions.
10. Archive results with configuration versions.

## Decision points
Use pairwise comparison when absolute scoring is unstable. Require human review for high-risk decisions or poorly calibrated judge dimensions.

## Common failure patterns
Single composite score; uncalibrated LLM judge; no baseline; ignoring abstention; quality improvements that violate latency SLO.

## Verification
Reproduce runs, calibrate judge agreement, and confirm release thresholds on held-out cases.

## Expected output
A release-quality evaluation report backed by traceable test evidence.

## Stop conditions
Stop release when critical correctness, grounding, security, or latency thresholds regress.