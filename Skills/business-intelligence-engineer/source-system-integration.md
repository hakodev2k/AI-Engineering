# Source System Integration

## Purpose
Integrate operational and external sources into BI pipelines with explicit contracts, reliable extraction, and minimal impact on source systems.

## When to use
Use when onboarding databases, SaaS APIs, files, event streams, or third-party feeds for analytics.

## Inputs
Source documentation, credentials model, schemas, API limits, volumes, change semantics, SLA, privacy classification.

## Context to inspect
Inspect source ownership, keys, update/delete behavior, rate limits, maintenance windows, extraction options, historical availability, and data sensitivity.

## Core knowledge
Operational schemas are not analytical contracts. Extraction must account for mutable records, deletes, pagination, retries, rate limits, schema drift, and source load.

## Procedure
1. Define required entities, fields, history, and freshness.
2. Identify source owner and authoritative semantics.
3. Select extraction mechanism: CDC, replica, API, export, file, or events.
4. Establish schema/data contract and sensitivity classification.
5. Design incremental state, pagination, retry, timeout, and idempotency.
6. Handle deletes and corrections explicitly.
7. Land raw data with ingestion metadata sufficient for replay/audit where appropriate.
8. Validate completeness and source impact under realistic volume.
9. Add schema-drift and freshness monitoring.
10. Document backfill, replay, credential rotation, and source outage behavior.

## Decision points
Prefer replicas/CDC over heavy production queries for large database extraction. Use API backoff and bounded retries; do not retry permanent validation/authentication failures indefinitely.

## Common failure patterns
Using updated_at without overlap, ignoring deletes, unbounded API pagination, source overload, silent schema drift, and storing secrets in pipeline code.

## Verification
Reconcile counts/key coverage, test retries and restartability, measure source load, and validate sensitive-data controls.

## Expected output
Reliable source connector/pipeline with explicit contract, recovery behavior, monitoring, and reconciliation evidence.

## Stop conditions
Stop when access is unauthorized, source owner cannot confirm semantics, extraction risks production stability, or sensitive-data handling lacks approval.