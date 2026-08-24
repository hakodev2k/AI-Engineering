# Relevance Judgments

## Purpose
Create reliable human relevance labels that represent user intent and support trustworthy offline evaluation and model training.

## When to use
Use when establishing a benchmark set, training ranking models, evaluating major search changes, or investigating disagreement between metrics and user outcomes.

## Inputs
Query samples, candidate results, product/search objectives, domain taxonomy, annotator capacity, privacy constraints.

## Context to inspect
Existing label scales, judgment guidelines, sampling strategy, annotator agreement, adjudication process, and query-segment coverage.

## Core knowledge
Judgments are measurement instruments. Ambiguous guidelines, biased query sampling, and inconsistent treatment of intent produce misleading metrics. Graded labels usually preserve more ranking information than binary labels.

## Procedure
1. Define relevance in terms of user intent and task success.
2. Choose binary or graded labels with explicit examples.
3. Sample queries across head, torso, tail, zero-result, and critical segments.
4. Pool candidates from multiple retrieval/ranking systems to reduce system bias.
5. Blind annotators to source systems.
6. Train annotators on calibration examples.
7. Measure inter-annotator agreement.
8. Adjudicate systematic disagreements and revise guidance.
9. Version judgments and metadata.
10. Refresh sets as catalog and query distribution evolve.

## Decision points
Use experts for specialized domains; crowd annotation when guidelines can be made objective. Prefer graded labels for NDCG-oriented evaluation and binary labels for simple recall tasks.

## Common failure patterns
Only judging current top results, using popularity as relevance, missing intent context, inconsistent duplicate handling, and changing guidelines without versioning.

## Verification
Check segment coverage, agreement statistics, duplicate consistency, blind spot analysis, and stability of benchmark conclusions under resampling.

## Expected output
Versioned judgment set, labeling guide, sampling method, agreement evidence, adjudication notes, and known limitations.

## Stop conditions
Stop when annotators cannot resolve the intended task, sensitive data cannot be handled safely, or label disagreement remains too high for valid evaluation.