# Threat Intelligence Platform Operations

## Purpose
Operate a threat-intelligence platform (TIP) so entities, relationships, provenance, scoring, sharing, and lifecycle automation remain trustworthy.

## When to use
Use when designing or maintaining intelligence repositories, ingestion pipelines, enrichment, or downstream integrations.

## Inputs
Source feeds, schemas, entity model, scoring rules, sharing policies, integrations, retention requirements.

## Context to inspect
Review data volumes, duplicate rates, taxonomy, STIX/TAXII usage, access controls, API limits, downstream SIEM/SOAR consumers, and audit needs.

## Core knowledge
A TIP is a knowledge system, not a feed bucket. Data quality depends on normalized identity, temporal relationships, provenance, confidence, and lifecycle controls.

## Procedure
1. Define entity and relationship model.
2. Normalize incoming formats and timestamps.
3. Preserve source and transformation provenance.
4. Deduplicate with conservative merge rules.
5. Apply scoring and expiration policies.
6. Enrich only with traceable sources.
7. Enforce markings and access controls.
8. Integrate downstream systems with scoped filters.
9. Monitor ingestion failures, latency, duplication, and stale data.
10. Periodically review taxonomy and automation.

## Decision points
Automate deterministic normalization and expiry; keep ambiguous entity merges and high-impact sharing decisions reviewable.

## Common failure patterns
Unbounded ingestion, destructive deduplication, lost provenance, permanent confidence scores, secret leakage, and exporting every IOC everywhere.

## Verification
Sample entities retain provenance, lifecycle rules execute, integrations deliver scoped data, and audit logs explain transformations.

## Expected output
Reliable TIP configuration with schemas, lifecycle rules, integrations, monitoring, and governance.

## Stop conditions
Stop ingestion/sharing when markings, licensing, access control, or provenance cannot be preserved.