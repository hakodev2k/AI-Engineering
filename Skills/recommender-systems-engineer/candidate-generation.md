# Candidate Generation

## Purpose
Build high-recall candidate retrieval that narrows large inventories without eliminating relevant items prematurely.

## When to use
Use when inventories are too large for full ranking or when recall/latency bottlenecks occur.

## Inputs
Inventory, user/context features, interactions, eligibility rules, latency budget, and retrieval evaluation set.

## Context to inspect
Existing candidate sources, ANN indexes, freshness, filters, quotas, cache behavior, and downstream ranker capacity.

## Core knowledge
Retrieval optimizes recall under strict cost. Multiple sources often cover complementary intent: popularity, collaborative, content, graph, rules, and embedding ANN. Candidate provenance should remain observable.

## Procedure
1. Define eligible universe and target recall metric.
2. Establish a simple popularity or heuristic baseline.
3. Evaluate candidate sources independently by cohort.
4. Add collaborative/content/embedding sources where they add incremental recall.
5. Deduplicate while retaining source provenance.
6. Apply hard eligibility before ranking when correctness requires it.
7. Tune per-source quotas and total candidate budget.
8. Measure recall, coverage, latency, freshness, and downstream lift.

## Decision points
Use ANN for semantic scale; exact search for small inventories or correctness-critical retrieval. Favor source ensembles when user intents differ materially.

## Common failure patterns
Optimizing precision at retrieval, stale indexes, hidden filtering after recall measurement, source domination, duplicate candidates, and evaluating only active users.

## Verification
Measure recall@K against held-out positives, source contribution, tail coverage, latency percentiles, and eligibility correctness.

## Expected output
A reproducible candidate pipeline with measured recall/cost and explicit source policies.

## Stop conditions
Stop if eligible inventory cannot be defined or retrieval evaluation is contaminated by future information.