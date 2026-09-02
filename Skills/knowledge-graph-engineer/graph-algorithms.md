# Graph Algorithms

## Purpose
Select and apply graph algorithms to solve ranking, connectivity, community, similarity, path, and structural analysis problems without confusing mathematical output with business meaning.

## When to use
Use for recommendations, fraud rings, dependency analysis, influence, segmentation, shortest paths, anomaly discovery, or graph feature generation.

## Inputs
Business question, graph projection, node/edge semantics, weight definitions, algorithm candidates, scale constraints, and evaluation criteria.

## Preconditions
Confirm that graph topology meaningfully represents the phenomenon being measured and that edge direction/weight semantics are valid.

## Context to inspect
Degree distribution, connected components, edge weights, temporal scope, missing links, projection filters, high-degree hubs, and algorithm implementation limits.

## Core knowledge
Centrality, community detection, similarity, path algorithms, connected components, and embeddings answer different questions. Algorithm output is conditional on graph construction; biased or incomplete topology produces biased scores.

## Procedure
1. Define the business hypothesis and evaluation metric.
2. Construct the minimal graph projection needed.
3. Validate edge direction and weight interpretation.
4. Profile component size and degree distribution.
5. Choose an algorithm whose assumptions fit the graph.
6. Establish simple baselines.
7. Run on a representative subset before full scale.
8. Inspect sensitivity to hubs, missing data, and parameter choices.
9. Validate results against known examples or labels.
10. Measure runtime and memory cost.
11. Decide whether results are computed offline, incrementally, or on demand.
12. Version algorithm configuration and projection rules.

## Decision points
Use exact paths for operational routing when feasible; approximate methods for large analytical workloads when error is acceptable. Prefer explainable graph metrics when decisions require auditability.

## Common failure patterns
Using PageRank as generic importance; ignoring edge direction; arbitrary weights; evaluating only algorithm scores; leakage from future edges; and computing expensive algorithms online without capacity analysis.

## Verification
Check known-node rankings, synthetic graph cases, stability across parameter changes, runtime/memory limits, and business metric lift versus baseline.

## Expected output
Algorithm choice, graph projection, parameters, validation evidence, and production execution strategy.

## Stop conditions
Stop when topology does not support the intended inference or results would drive high-impact decisions without adequate validation.