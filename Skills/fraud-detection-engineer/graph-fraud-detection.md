# Graph Fraud Detection

## Purpose
Use relationships among accounts, devices, identities, merchants, addresses, instruments, and transactions to identify coordinated or hidden fraud patterns.

## When to use
Use when fraud involves shared infrastructure, collusion, mule networks, synthetic identities, account farms, or repeated cross-account behavior. Do not build graph complexity when entity linkage is unreliable or relational patterns add no measurable value.

## Inputs
- Entity and event identifiers
- Link confidence rules
- Historical fraud outcomes
- Graph storage or processing options
- Real-time latency requirements

## Context to inspect
Inspect identifier reuse, identity resolution, device quality, graph density, temporal validity, privacy restrictions, known clusters, and existing network-based rules.

## Core knowledge
Graph signal quality depends on edge semantics and time. Degree, connected components, path structure, community features, shared-neighbor patterns, propagation scores, and graph embeddings can expose coordination, but noisy edges can contaminate entire neighborhoods.

## Procedure
1. Define entity and edge types with explicit semantics.
2. Assign confidence and temporal validity to links.
3. Prevent future edges from leaking into historical training.
4. Compute simple graph features before advanced embeddings.
5. Test fraud concentration by neighborhood and component.
6. Add temporal and directional constraints where behavior demands them.
7. Measure incremental lift beyond non-graph features.
8. Design bounded online lookups for latency-sensitive decisions.
9. Create investigator views that explain important relationships.
10. Monitor graph-density and identifier-quality drift.

## Decision points
Use batch graph analytics for expensive global structure and precompute online features when latency matters. Use embeddings only if simpler topology features cannot capture needed interactions.

## Common failure patterns
- Treating weak identifiers as certain edges
- Leakage from future graph state
- Giant components caused by shared infrastructure
- Unexplainable graph scores
- Unbounded traversal in online decisions

## Verification
Validate edge precision, temporal correctness, fraud concentration, ablation lift, online latency, and investigator interpretability.

## Expected output
A versioned graph schema and detection workflow with validated relationship signals and bounded serving behavior.

## Stop conditions
Stop when linkage quality is insufficient, privacy rules prohibit the linkage, or graph signals cannot be evaluated without future information.