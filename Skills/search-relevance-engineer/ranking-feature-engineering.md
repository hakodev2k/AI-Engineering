# Ranking Feature Engineering

## Purpose
Design robust ranking features that represent textual relevance, authority, freshness, quality, context, and user intent without leaking labels or encoding unstable business logic.

## When to use
Use when building a ranker, improving heuristic scoring, or preparing features for learning-to-rank.

## Inputs
Judgments, query logs, document metadata, retrieval scores, behavioral signals, feature-store capabilities, serving constraints.

## Context to inspect
Current boosts, score functions, feature definitions, data freshness, missing-value handling, transformations, and feature availability at serving time.

## Core knowledge
A useful ranking feature must be causally available at prediction time, stable enough to monitor, and interpretable enough to diagnose. Behavioral features can encode position bias and popularity feedback loops.

## Procedure
1. Map ranking objectives to candidate feature families.
2. Separate query, document, query-document, and context features.
3. Verify serving-time availability and cost.
4. Define units, transformations, bounds, and missing-value behavior.
5. Remove direct or indirect label leakage.
6. Analyze distributions by query segment.
7. Check correlation and redundancy.
8. Add features incrementally with ablation tests.
9. Version feature definitions.
10. Monitor drift and data-quality failures.

## Decision points
Prefer simple monotonic features when domain relationships are known. Use behavioral signals only after correcting or accounting for exposure bias. Drop expensive features if marginal relevance does not justify latency.

## Common failure patterns
Label leakage, unbounded values, serving/training skew, implicit zero-as-missing semantics, duplicated popularity signals, and features that encode temporary campaigns permanently.

## Verification
Run ablations, inspect distributions, verify online/offline parity, measure ranking metrics and latency, and test missing-data behavior.

## Expected output
Feature specification, data lineage, transformations, cost, ablation evidence, monitoring thresholds, and known biases.

## Stop conditions
Stop when a feature cannot be reproduced at serving time, provenance is unknown, or it introduces unacceptable privacy or fairness risk.