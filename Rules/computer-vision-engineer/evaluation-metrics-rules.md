# Evaluation Metrics Rules

## Purpose
Ensure metrics reflect the actual vision task and operational consequences.

## Scope
Classification, detection, segmentation, retrieval, OCR, tracking, pose, and multimodal evaluation.

## MUST
- Primary metrics MUST map to explicit product, safety, or operational requirements.
- Threshold-dependent systems MUST report performance at the intended operating point, not only aggregate curves.
- Evaluation MUST include uncertainty or variability when sample size, stochasticity, or subgroup size can affect conclusions.
- Metric definitions, matching rules, IoU thresholds, averaging, ignored classes, and confidence handling MUST be explicit.

## MUST NOT
- A single aggregate metric MUST NOT conceal known critical-class or subgroup failures.
- Metric improvements MUST NOT be claimed from incomparable datasets or evaluation protocols.

## SHOULD
- Error costs SHOULD inform precision-recall trade-offs and threshold selection.

## Exceptions
Proxy metrics are acceptable only with documented relationship to the target outcome and limitations.

## Verification
Review evaluation code, metric configuration, operating thresholds, confidence intervals, subgroup reports, and reproducible baseline comparisons.