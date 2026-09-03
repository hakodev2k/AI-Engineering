# Memory Observability

## Purpose
Instrument memory extraction, persistence, retrieval, ranking, deletion, and user correction so production behavior is measurable without exposing sensitive content.

## When to use
Use when operating persistent AI memory in production or diagnosing unexplained memory quality changes.

## Inputs
Architecture, SLOs, memory taxonomy, logs, metrics platform, trace system, privacy constraints.

## Preconditions
Define what telemetry may contain and prohibit raw sensitive memory content from routine logs.

## Context to inspect
Write/read paths, queues, model calls, indexes, caches, deletion jobs, authorization filters, and error handling.

## Core knowledge
Useful telemetry captures metadata and lifecycle transitions: extraction acceptance, duplicate rate, retrieval relevance, age, latency, conflicts, cache behavior, and deletion completion. Observability must not create a shadow memory store in logs.

## Procedure
1. Define service and quality SLOs.
2. Instrument extraction and persistence stages.
3. Trace retrieval and ranking with safe identifiers.
4. Record memory type, age, score bands, and result counts.
5. Track conflicts, corrections, and deletions.
6. Measure index lag and cache behavior.
7. Add alerts for isolation, freshness, and error anomalies.
8. Build dashboards by tenant-safe aggregates.
9. Validate log redaction.
10. Link alerts to runbooks.

## Decision points
Prefer aggregate telemetry to raw memory payloads. Sample detailed traces only when policy permits and operational need is clear.

## Common failure patterns
Logging full memories; measuring uptime but not retrieval quality; no deletion metrics; traces without model/index versions.

## Verification
Inject controlled failures and verify metrics, traces, and alerts identify the affected stage without leaking protected content.

## Expected output
A privacy-aware observability specification, dashboards, alerts, and runbook links.

## Stop conditions
Stop when required telemetry would violate privacy or retention policy.