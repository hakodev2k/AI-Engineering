# Graph Observability

## Purpose
Instrument knowledge-graph systems so engineers can detect semantic, performance, freshness, ingestion, and AI-retrieval failures before they create broad downstream impact.

## When to use
Use when operating production graph platforms, graph ingestion, entity resolution, inference, graph-RAG, or graph APIs.

## Inputs
Architecture, SLOs, graph workloads, ingestion SLAs, query metrics, data-quality rules, incident history, downstream AI requirements.

## Preconditions
Critical user journeys and graph pipelines are known.

## Context to inspect
Database metrics, query logs, ingestion telemetry, graph statistics, validation reports, entity-resolution metrics, retrieval traces, provider/platform dashboards.

## Core knowledge
Graph health is not captured by CPU and availability alone. A healthy database can serve stale, fragmented, semantically invalid, cross-linked, or authorization-incomplete knowledge. Observability must include structure and data semantics.

## Procedure
1. Define SLOs for query latency, availability, freshness, and ingestion success.
2. Track node/edge growth by type and source.
3. Monitor orphan rates, duplicate identity indicators, constraint violations, and high-degree nodes.
4. Track ingestion lag, retry rate, dead letters, and schema drift.
5. Monitor query latency and plan regressions by query class.
6. Track inference volume and invalidation lag.
7. Instrument graph-RAG entity linking, retrieval size, latency, and citation coverage.
8. Add authorization-denial and cross-tenant anomaly signals.
9. Build dashboards around actionable failure modes.
10. Validate alerts using controlled failure injection.

## Decision points
Alert on user or semantic impact rather than raw metric movement. Segment metrics by source, tenant, entity type, graph version, and query family when global averages hide localized failures.

## Common failure patterns
Monitoring only database infrastructure, no freshness metrics, no graph-topology signals, unbounded metric cardinality, no correlation IDs across ingestion/query/LLM paths, and dashboards without owners.

## Verification
Simulated stale ingestion, constraint violations, slow traversals, and retrieval failures trigger actionable telemetry and identify the affected graph component.

## Expected output
Graph SLOs, dashboards, alerts, semantic-health metrics, correlation strategy, and responder runbooks.

## Stop conditions
Escalate production readiness when critical graph failure modes cannot be observed or bounded with available telemetry.