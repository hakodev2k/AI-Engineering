# Data Ingestion Design

## Purpose
Design reliable ingestion paths that move data from producers into the platform with explicit contracts, replay behavior, quality controls, and operational ownership.

## When to use
Use when onboarding sources, replacing fragile transfers, or scaling ingestion. Avoid introducing streaming when batch latency already satisfies the requirement.

## Inputs
Source interfaces, schemas, volumes, change rates, latency targets, delivery guarantees, retention, security classification, and consumer expectations.

## Context to inspect
Producer limits, network paths, source-of-truth semantics, existing connectors, landing zones, checkpoints, retry policies, dead-letter handling, and historical incidents.

## Core knowledge
Ingestion correctness depends on identity, ordering, deduplication, checkpointing, backpressure, schema evolution, and replay. Exactly-once is usually an end-to-end property built from idempotency and transactional boundaries rather than a connector checkbox.

## Procedure
1. Establish source ownership and authoritative records.
2. Define data contract, keys, event time, schema evolution, and deletion semantics.
3. Quantify throughput, burst, latency, and replay requirements.
4. Choose batch, CDC, events, files, or API extraction based on source capability and SLO.
5. Define checkpoints and restart behavior.
6. Design idempotency, deduplication, ordering, and late-data handling.
7. Add validation and quarantine before polluted data propagates.
8. Protect credentials and data in transit and at rest.
9. Add metrics for lag, throughput, failures, freshness, and rejected records.
10. Test source throttling, duplicates, malformed records, outages, and replay.
11. Document ownership and runbook procedures.

## Decision points
Use CDC when low-latency database changes are required and log access is supportable; prefer scheduled extraction for simpler low-frequency needs. Push-based ingestion reduces polling but increases producer coupling. Preserve raw immutable data when replay and audit value justify storage.

## Common failure patterns
Offset loss, silent partial loads, duplicate side effects, uncontrolled retries, schema drift, assuming arrival time equals event time, no backpressure, and replay that overloads downstream systems.

## Verification
Reconcile source and landed counts or business keys; inject duplicates and malformed data; restart mid-transfer; replay a bounded interval; verify lag alerts and access controls.

## Expected output
An ingestion design and implementation with contracts, checkpoints, replay procedure, quality gates, observability, tests, and ownership.

## Stop conditions
Stop when the source cannot provide stable identity or semantics, replay could cause destructive side effects, required credentials are unavailable, or data handling approval is missing.