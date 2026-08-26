# Embedding Model Selection

## Purpose
Select and validate embedding models against real retrieval requirements rather than benchmark reputation.

## When to use
Use for a new dense index, multilingual expansion, domain shift, or embedding migration.

## Inputs
Representative queries/passages, languages, domain vocabulary, latency, cost, deployment constraints, model limits.

## Context to inspect
Inspect query lengths, corpus languages, identifiers, similarity metric, dimensionality, provider limits, privacy requirements, and baseline retrieval.

## Core knowledge
Embedding quality is task-specific. Model changes can alter vector dimensions, normalization assumptions, cost, latency, and index compatibility. Retrieval evaluation must include hard negatives.

## Procedure
1. Define retrieval metrics and operational constraints.
2. Assemble labeled queries with relevant and difficult non-relevant passages.
3. Shortlist models compatible with language and deployment needs.
4. Apply required query/document prefixes or normalization.
5. Build isolated candidate indexes.
6. Evaluate recall and ranking across query segments.
7. Measure embedding throughput, latency, and storage impact.
8. Test domain entities and multilingual cases explicitly.
9. Compare downstream answer quality.
10. Plan versioned migration and rollback before replacement.

## Decision points
Prefer the simplest model meeting quality targets. Self-host only when privacy, cost at scale, customization, or latency justifies operational complexity.

## Common failure patterns
Choosing by public leaderboard alone; mixing vectors from incompatible models; ignoring normalization; no hard negatives; migration without reindex plan.

## Verification
Reproduce evaluation results, validate vector schema, compare operational metrics, and run shadow or staged migration tests.

## Expected output
A model decision with measured quality, cost, compatibility, and migration evidence.

## Stop conditions
Stop when representative evaluation data or deployment/privacy constraints are unknown.