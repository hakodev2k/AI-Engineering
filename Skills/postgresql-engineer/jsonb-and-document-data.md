# JSONB and Document Data

## Purpose
Use PostgreSQL JSONB deliberately for semi-structured data while retaining queryability, integrity, and operational performance.

## When to use
Use for variable attributes, external payloads, sparse metadata, or evolving document fragments. Do not use JSONB to bypass known relational structure.

## Inputs
Document shapes, query/update patterns, validation needs, data volume and retention.

## Context to inspect
Existing relational columns, JSON predicates, indexes, document sizes, update frequency and schema-version behavior.

## Core knowledge
JSONB supports containment, path operations, expression indexes and GIN. Whole-document updates can amplify writes; unrestricted structure weakens database-level guarantees.

## Procedure
1. Separate stable relational invariants from flexible attributes.
2. Define allowed document shape/version expectations.
3. Store frequently joined/filtered invariant fields relationally when appropriate.
4. Choose operators matching query semantics.
5. Index only demonstrated JSON access paths.
6. Consider generated columns/expression indexes for hot fields.
7. Validate payload size and update patterns.
8. Test null versus missing-key semantics.
9. Benchmark realistic documents.
10. Plan document evolution.

## Decision points
Use GIN for broad containment/key workloads; expression B-tree indexes for selective scalar paths. Normalize when relationships and constraints dominate.

## Common failure patterns
One giant JSON document per entity, indiscriminate GIN indexes, hidden schema drift, full-document rewrites for tiny changes.

## Verification
Test semantic edge cases, plans, index size, write amplification and migration compatibility.

## Expected output
Storage model, validation rules, query/index strategy, performance evidence.

## Stop conditions
Stop if critical invariants cannot be reliably enforced with the proposed document model.