# Knowledge Freshness and Versioning

## Purpose
Keep AI-accessible knowledge current, versioned, and temporally interpretable so users do not receive obsolete guidance as if it were present truth.

## When to use
Use when sources change frequently, policies or product docs have effective dates, or retrieval mixes current and historical versions.

## Inputs
Source timestamps, version identifiers, update cadence, effective dates, synchronization mechanisms, retention rules, and query semantics.

## Context to inspect
Inspect ingestion lag, stale indexes, duplicate versions, source update histories, cache TTLs, tombstones, and queries involving dates or historical state.

## Core knowledge
Freshness is not merely latest-ingestion time. Publication date, effective date, source modification time, ingestion time, and supersession state have different meanings. Historical knowledge may remain valid for time-scoped questions.

## Procedure
1. Define relevant temporal fields for each source type.
2. Distinguish current, future-effective, superseded, archived, and deleted states.
3. Preserve version lineage and stable logical document IDs.
4. Implement incremental refresh and deletion propagation.
5. Define freshness SLAs by source criticality.
6. Apply temporal filters or ranking preferences based on query intent.
7. Keep historical versions when required for audit or time-specific questions.
8. Detect stale indexes and synchronization gaps.
9. Validate cutover behavior when a new version becomes effective.
10. Monitor age distributions and freshness SLA breaches.

## Decision points
Delete superseded content only when retention and historical use cases allow it. Prefer explicit effective-date semantics over naïve newest-wins ranking in regulated or policy-heavy domains.

## Common failure patterns
Using ingestion time as publication time, retaining old and new versions without lineage, failing to process deletions, and caching answers longer than underlying knowledge validity.

## Verification
Test updates, scheduled effective dates, rollbacks, deletions, and historical queries. Confirm production indexes reflect expected versions within SLA.

## Expected output
A versioning and freshness policy with lifecycle states, synchronization SLAs, temporal retrieval rules, and monitoring.

## Stop conditions
Stop when authoritative timestamps are unavailable for critical content or retention rules conflict with version deletion behavior.