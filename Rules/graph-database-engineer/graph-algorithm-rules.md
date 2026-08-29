# Graph Algorithm Rules

## Purpose
Run graph algorithms with explicit semantics, reproducibility, and bounded operational risk.

## Scope
Centrality, community detection, similarity, pathfinding, embeddings, projections, and other graph analytics.

## MUST
- Define the graph projection, directionality, weights, filters, and algorithm parameters used for each material result.
- Validate that the algorithm's assumptions match the domain interpretation.
- Measure memory, runtime, and concurrency impact before production-scale execution.
- Version inputs and parameters when outputs influence downstream decisions.
- Validate algorithm outputs against domain expectations and known cases.

## MUST NOT
- Treat algorithm scores as ground truth without validation.
- Run resource-intensive algorithms on production serving capacity without approved isolation or impact controls.
- Compare scores across materially different graph projections without qualification.

## SHOULD
- Use sampled or staged runs to estimate resource needs.
- Record randomness seeds where supported and reproducibility matters.

## Exceptions
Exploratory analysis may use provisional parameters, but outputs MUST be labeled exploratory and MUST NOT silently drive production decisions.

## Verification
Inspect projection definitions, parameter records, resource estimates, reproducibility checks, validation datasets, runtime telemetry, and downstream use of outputs.