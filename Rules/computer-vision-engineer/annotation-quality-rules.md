# Annotation Quality Rules

## Purpose
Make labels reliable enough to support defensible training and evaluation.

## Scope
Classification, detection, segmentation, tracking, keypoints, OCR, multimodal labels, and derived ground truth.

## MUST
- Annotation guidelines MUST define class semantics, boundary cases, ambiguity handling, and abstention behavior.
- Critical labels MUST have measured quality using audits, agreement studies, adjudication, or equivalent evidence.
- Label revisions MUST be versioned and traceable to affected samples and model evaluations.
- Evaluation labels MUST receive stronger independence or review controls than ordinary training labels when practical.

## MUST NOT
- Ambiguous samples MUST NOT be forced into arbitrary labels merely to complete a dataset.
- Training-derived predictions MUST NOT become ground truth without controlled review.

## SHOULD
- Reviewer disagreement SHOULD be analyzed as a signal of taxonomy or task ambiguity.
- Annotation tooling SHOULD enforce schema constraints automatically.

## Exceptions
Any reduced review regime requires documented risk, expected error rate, sampling rationale, and compensating verification.

## Verification
Inspect guidelines, audit samples, agreement metrics, adjudication records, label-version history, and schema-validation results.