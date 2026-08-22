# GraphQL Schema Design

## Purpose
Design durable GraphQL schemas that express domain capabilities clearly while preserving evolvability, security, and predictable client behavior.

## When to use
Use when introducing or revising types, fields, mutations, interfaces, unions, enums, or input objects. Do not use GraphQL schema changes to conceal unclear domain requirements.

## Inputs
Business requirements, existing schema, consumer queries, domain model, authorization rules, data sources, and compatibility constraints.

## Preconditions
Confirm the current schema and known consumers can be inspected. Identify ownership of the affected domain.

## Context to inspect
Review naming conventions, nullability, pagination patterns, IDs, mutation payloads, directives, federation boundaries, deprecations, and resolver ownership.

## Core knowledge
A GraphQL schema is a public contract. Prefer domain-oriented fields over storage-shaped models. Nullability is a compatibility decision. Additive evolution is usually safer than breaking replacement. Inputs and outputs often evolve differently.

## Procedure
1. Identify consumer jobs and domain concepts.
2. Inspect related schema patterns before designing new ones.
3. Define stable object and input boundaries.
4. Choose nullability from actual guarantees, not convenience.
5. Model polymorphism deliberately with interfaces or unions.
6. Design mutations around business operations and useful payloads.
7. Apply pagination to potentially unbounded collections.
8. Define authorization expectations per exposed capability.
9. Check naming, discoverability, and consistency.
10. Evaluate compatibility with existing queries.
11. Add descriptions and deprecation guidance where useful.
12. Validate the schema and exercise representative operations.

## Decision points
Use interfaces for shared contracts and unions for heterogeneous results without a shared field contract. Prefer opaque stable IDs when backend identifiers should not leak. Use nullable fields only when absence is a legitimate state or guarantee cannot be made.

## Common failure patterns
Mirroring database tables, excessive nullable fields, giant generic mutations, inconsistent pagination, exposing internal identifiers, breaking enum changes, and schema duplication across domains.

## Verification
Run schema validation, compatibility checks, representative client queries, authorization tests, and introspection/documentation review. Implemented means schema exists; verified means consumers can safely use it under expected failure and permission conditions.

## Expected output
A coherent, documented, backward-aware schema change with explicit domain and security semantics.

## Stop conditions
Stop when domain ownership is unresolved, compatibility impact cannot be assessed, or the requested contract would expose data without an approved authorization model.