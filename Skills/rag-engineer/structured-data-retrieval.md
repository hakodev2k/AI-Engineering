# Structured Data Retrieval

## Purpose
Integrate exact structured facts with document retrieval when vector search is the wrong mechanism for transactional or schema-bound data.

## When to use
Use for inventories, account state, metrics, relational facts, catalog attributes, or other structured sources.

## Inputs
Schema, business semantics, authorization rules, query examples, data freshness, API/database interfaces.

## Context to inspect
Inspect system-of-record ownership, joins, units, time zones, null semantics, query limits, read consistency, and access controls.

## Core knowledge
Embeddings are poor substitutes for exact filtering, aggregation, and transactional facts. Structured retrieval should expose constrained operations rather than arbitrary model-generated queries where risk is high.

## Procedure
1. Identify facts that require structured lookup.
2. Define a typed semantic contract for permitted queries.
3. Map user intent to constrained parameters.
4. Enforce authorization independently of the model.
5. Execute parameterized queries or approved APIs.
6. Normalize units, timestamps, and nulls explicitly.
7. Return compact facts with provenance and freshness metadata.
8. Combine with document evidence only when needed.
9. Test ambiguous entities and empty results.
10. Monitor expensive or anomalous query patterns.

## Decision points
Prefer domain APIs for complex business semantics; direct read queries may be suitable for well-governed analytical stores. Use documents for explanations and structured sources for exact state.

## Common failure patterns
Vectorizing rapidly changing numeric facts; unrestricted text-to-SQL against production; missing tenant predicates; silent timezone conversion; stale replicas treated as current.

## Verification
Compare outputs with authoritative records, test authorization and parameterization, and validate boundary/aggregation cases.

## Expected output
A constrained structured retrieval path that complements document RAG.

## Stop conditions
Stop when query authorization, schema semantics, or production-read safety is unresolved.