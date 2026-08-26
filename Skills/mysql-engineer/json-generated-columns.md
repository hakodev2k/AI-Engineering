# JSON and Generated Columns

## Purpose
Model semi-structured data in MySQL JSON while retaining validation, queryability, and index performance where needed.

## When to use
Use for evolving attributes, external payloads, sparse metadata, or JSON query optimization.

## Inputs
JSON shape, validation rules, query predicates, update patterns, retention, indexing needs.

## Context to inspect
MySQL version, JSON functions, generated/functional indexes, existing relational columns, payload size and schema stability.

## Core knowledge
JSON is useful for semi-structured data but weakens relational constraints if overused. Frequently queried stable attributes often belong in typed columns. Generated/functional indexes can expose JSON paths efficiently.

## Procedure
1. Classify fields as stable relational attributes versus genuinely flexible metadata.
2. Define acceptable JSON structure and size.
3. Validate required shape at application/database boundary as appropriate.
4. Identify paths used in filters, joins, or ordering.
5. Promote stable/high-value paths to typed or generated columns when needed.
6. Add indexes only for proven access paths.
7. Test partial updates and concurrent mutation semantics.
8. Benchmark extraction and indexing costs.
9. Plan schema evolution for payload versions.

## Decision points
Prefer relational columns for constraints, joins, and high-frequency predicates. Keep JSON when shape variability is real and query demands are modest.

## Common failure patterns
Storing entire domain models as opaque JSON, no validation/versioning, repeated full-document rewrites, unindexed path scans, and type inconsistency inside JSON.

## Verification
Test valid/invalid documents, query plans, index use, update behavior, and backward compatibility across payload versions.

## Expected output
A bounded JSON model with explicit validation and indexing strategy.

## Stop conditions
Stop if critical invariants cannot be enforced, payload semantics are undefined, or JSON use prevents required query performance.