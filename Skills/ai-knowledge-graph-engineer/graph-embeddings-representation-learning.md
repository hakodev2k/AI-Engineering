# Graph Embeddings and Representation Learning

## Purpose
Design and evaluate graph embeddings for similarity, recommendation, link prediction, entity retrieval, and AI features without confusing embedding proximity with semantic truth.

## When to use
Use when graph structure or attributes should inform ML retrieval, ranking, clustering, anomaly detection, or downstream model features.

## Inputs
Graph schema, task definition, positive/negative examples, candidate embedding methods, graph size, update frequency, latency constraints.

## Preconditions
Define the downstream task and evaluation metric before selecting an embedding technique.

## Context to inspect
Node/edge types, graph sparsity, connected components, feature availability, leakage risks, train/validation splits, serving architecture.

## Core knowledge
Methods such as random-walk embeddings, knowledge-graph embeddings, GNNs, and hybrid text-graph encoders optimize different notions of similarity. Temporal and graph-neighborhood leakage can make offline results misleading.

## Procedure
1. Define the target task and decision boundary.
2. Build leakage-safe temporal or structural splits.
3. Select baselines before complex models.
4. Choose negative-sampling strategy aligned with production candidates.
5. Train embeddings with reproducible seeds/configuration.
6. Measure task metrics and subgroup behavior.
7. Inspect nearest neighbors for semantic plausibility.
8. Evaluate cold-start and disconnected entities.
9. Define refresh/versioning strategy.
10. Benchmark serving latency and storage cost.

## Decision points
Use simple graph embeddings for stable homogeneous structure; use typed KGE methods for relation semantics; use GNNs when neighborhood features materially improve the task and operational complexity is justified.

## Common failure patterns
Random splits that leak future edges, easy negatives, evaluating only embedding loss, stale embeddings after major graph updates, and using cosine similarity as proof of factual relation.

## Verification
Compare against non-graph baselines, test leakage-safe holdouts, inspect neighbors, and validate production retrieval latency.

## Expected output
A versioned embedding pipeline, evaluation report, refresh policy, serving contract, and known limitations.

## Stop conditions
Stop when graph quality is insufficient, leakage cannot be controlled, or embedding improvements do not justify serving complexity.