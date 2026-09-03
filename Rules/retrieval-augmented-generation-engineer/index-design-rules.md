# Index Design Rules

## Purpose
Define index structures that support reliable, secure, and operable retrieval at production scale.

## Scope
Applies to vector, keyword, hybrid, hierarchical, metadata, and auxiliary retrieval indexes.

## MUST
- Index design MUST define the retrieval unit, searchable fields, filterable metadata, distance or scoring semantics, and update strategy.
- Index schemas MUST preserve authorization and provenance metadata required at query time.
- Index changes MUST be versioned and evaluated for relevance, latency, memory or storage use, and migration risk.
- Rebuild procedures MUST be repeatable from authoritative source data.
- Stale, deleted, or superseded content MUST have a defined removal path.
- Production indexes MUST expose health, freshness, size, and update-failure metrics.

## MUST NOT
- Indexes MUST NOT be treated as the sole authoritative copy of source content unless explicitly designed and governed as such.
- Index schema changes MUST NOT silently reinterpret existing metadata or scores.
- Access-control filtering MUST NOT depend on optional metadata that may be missing for restricted content.

## SHOULD
- Use separate indexes or namespaces when isolation, lifecycle, or scaling characteristics materially differ.
- Test index settings with representative corpus size and query distribution.
- Prefer migration strategies that allow side-by-side validation before cutover.

## Exceptions
Exceptions require documented rationale, impact analysis, rollback, and human approval for changes that can expose restricted data or require destructive production operations.

## Verification
Inspect index schemas, migration plans, rebuild tests, freshness dashboards, deletion tests, authorization-filter tests, and relevance/latency benchmarks.