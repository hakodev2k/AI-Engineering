# Search Relevance Architecture

## Purpose
Design an end-to-end search relevance system that separates ingestion, indexing, retrieval, ranking, evaluation, and serving responsibilities while preserving measurable quality and operational control.

## When to use
Use when creating a search platform, redesigning an existing search stack, introducing semantic retrieval, or reviewing scalability and relevance ownership.

## Inputs
Search use cases, corpus shape, query volume, latency SLOs, freshness needs, ranking objectives, infrastructure constraints, existing search engine and ML stack.

## Context to inspect
Current schemas, index topology, analyzers, retrieval stages, ranking logic, query logs, latency metrics, relevance evaluations, deployment process, and failure modes.

## Core knowledge
Search quality is a pipeline property. Retrieval recall, candidate quality, ranking precision, freshness, latency, and business rules interact. Architecture must allow each stage to be measured and changed independently.

## Procedure
1. Identify user intents and critical search journeys.
2. Define quality, latency, freshness, and availability objectives.
3. Separate ingestion, indexing, retrieval, ranking, and presentation boundaries.
4. Define candidate-generation stages and ranking stages.
5. Specify document and query feature ownership.
6. Define online/offline evaluation interfaces.
7. Plan index versioning and rollback.
8. Identify stateful components and consistency requirements.
9. Map failure modes to graceful degradation paths.
10. Validate design against representative workload and relevance cases.

## Decision points
Choose single-stage ranking for simplicity when quality is sufficient; multi-stage ranking when expensive features or models require candidate reduction. Prefer decoupled services when independent scaling or ownership is important.

## Common failure patterns
Embedding business rules directly into retrieval, no evaluation boundary, unversioned indexes, tightly coupled model and schema changes, and architecture optimized only for average latency.

## Verification
Confirm each stage has measurable inputs/outputs, rollback paths exist, representative queries meet latency budgets, and relevance can be evaluated independently of deployment.

## Expected output
Architecture diagram, stage responsibilities, data contracts, latency budgets, index lifecycle, fallback strategy, and unresolved risks.

## Stop conditions
Escalate when ranking goals conflict materially, latency budgets are infeasible, or critical data contracts are undefined.