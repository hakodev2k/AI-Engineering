# Offline Evaluation

## Purpose
Evaluate recommendation changes reproducibly before exposing users to them.

## When to use
Use for model selection, regressions, retrieval/ranking tuning, and release gates.

## Inputs
Time-aware evaluation dataset, baselines, candidate policy, labels, cohorts, and metric definitions.

## Context to inspect
Exposure policy, split method, candidate availability, leakage risks, confidence intervals, and metric implementation.

## Core knowledge
Recall, precision, MAP, MRR, NDCG, coverage, calibration, novelty, and diversity answer different questions. Offline gains do not guarantee causal online lift.

## Procedure
1. Freeze evaluation semantics and time window.
2. Reconstruct candidates available at each decision time.
3. Evaluate a production or simple baseline first.
4. Compute ranking and system-quality metrics at relevant K.
5. Segment by user activity, item popularity, locale, device, and other material cohorts.
6. Quantify uncertainty with appropriate resampling or repeated windows.
7. Inspect qualitative examples and largest regressions.
8. Record reproducible artifacts and release thresholds.

## Decision points
Choose metrics based on product utility; use multiple metrics only with clear precedence. Prefer temporal splits to random splits for evolving systems.

## Common failure patterns
Future leakage, full-catalog evaluation unlike production, metric cherry-picking, missing baselines, and aggregate-only reporting.

## Verification
Independent rerun produces the same metrics within tolerance; data lineage and model version are traceable.

## Expected output
An evaluation report with baseline comparison, cohort analysis, uncertainty, and go/no-go recommendation.

## Stop conditions
Stop if evaluation data violates point-in-time semantics or metric definitions are disputed.