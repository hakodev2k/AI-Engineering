# Production Troubleshooting for Knowledge Graph Systems

## Purpose
Provide a disciplined method for diagnosing production failures across graph storage, ingestion, semantics, queries, inference, identity resolution, and graph-backed AI applications.

## When to use
Use for incorrect graph answers, missing entities, duplicate nodes, stale relationships, slow queries, ingestion divergence, inference anomalies, graph-RAG failures, or authorization incidents.

## Inputs
Incident description, failing examples, query text, logs, metrics, traces, graph snapshots, recent deployments, schema/ontology versions, ingestion state.

## Preconditions
Preserve failing evidence before modifying production data. Prefer read-only investigation until blast radius and failure mode are understood.

## Context to inspect
Recent schema and ontology changes, ingestion checkpoints, source health, identity-resolution changes, query plans, indexes, constraint violations, inference jobs, caches, graph-RAG traces, feature flags.

## Core knowledge
Graph failures frequently surface far from their cause. A missing answer may originate in ingestion lag, failed entity resolution, an incorrect edge direction, stale materialization, authorization filtering, or a query-plan regression. Troubleshooting should find the earliest point where actual state diverges from expected state.

## Procedure
1. Capture a minimal reproducible failing query or user scenario.
2. Establish incident timing and affected entity/query classes.
3. Compare current behavior with last-known-good versions.
4. Trace the path from source data through ingestion to graph representation.
5. Validate canonical identity and expected relationships.
6. Inspect graph constraints and validation failures.
7. Run the smallest direct graph query that should expose the missing or incorrect fact.
8. Inspect execution plans for performance incidents.
9. Check inference/materialization and cache freshness.
10. Verify authorization filters independently of application logic.
11. Test a contained mitigation or rollback.
12. Re-run the original scenario and adjacent regression cases.
13. Document root cause, evidence, and prevention action.

## Decision points
Rollback when a recent reversible change strongly correlates with impact. Repair data only after identifying how corruption occurred, otherwise the pipeline may recreate it. Prefer narrow containment over broad graph rewrites.

## Common failure patterns
Editing production graph data before preserving evidence, blaming the graph database without tracing ingestion, treating duplicate identities as query bugs, optimizing before reproducing, and clearing caches without understanding invalidation.

## Verification
Verify the original failure no longer reproduces, source-to-graph reconciliation is correct, related queries pass, latency returns to baseline when relevant, and monitoring detects recurrence.

## Expected output
A reproducible incident record, root-cause analysis, validated mitigation, permanent corrective action, and regression test.

## Stop conditions
Escalate when investigation requires destructive production changes, sensitive-data access beyond current permissions, broad identity remapping, or changes to security/authorization boundaries.