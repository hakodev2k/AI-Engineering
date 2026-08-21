# Data Modeling

## Purpose
Design durable analytical and operational data structures that express business meaning, support expected access patterns, and evolve safely.

## When to use
Use when creating or changing datasets, warehouse models, lakehouse tables, event schemas, or serving models. Do not redesign stable models without a measurable need.

## Inputs
Business definitions, source schemas, query patterns, data volumes, freshness needs, retention rules, and downstream contracts.

## Context to inspect
Inspect source semantics, keys, cardinality, grain, history requirements, existing conventions, consumers, and platform constraints before choosing a model.

## Core knowledge
Grain must be explicit. Separate business meaning from physical optimization. Understand normalization, dimensional modeling, facts and dimensions, slowly changing dimensions, denormalization, schema evolution, and partition-aware design.

## Procedure
1. Define the business process and consumers.
2. State the grain in one precise sentence.
3. Identify stable business keys and relationships.
4. Classify measures, dimensions, attributes, and history needs.
5. Select a model appropriate to workload and ownership.
6. Define null, late-arriving, deletion, and correction semantics.
7. Design keys, partitions, clustering, and retention separately from logical meaning.
8. Document invariants and compatibility expectations.
9. Test representative queries and data volumes.
10. Review evolution paths before publishing the contract.

## Decision points
Prefer normalized models for transactional integrity and dimensional or denormalized models for analytical consumption when duplication improves usability and performance. Preserve raw history when source corrections or reprocessing are likely.

## Common failure patterns
Undefined grain, unstable natural keys, mixing facts of different grains, accidental many-to-many joins, destructive schema changes, and optimizing storage before understanding consumers.

## Verification
Validate uniqueness and relationship assumptions against real data, run representative queries, test historical behavior, and confirm downstream consumers interpret fields consistently.

## Expected output
A documented logical and physical data model with explicit grain, keys, history semantics, constraints, and evolution strategy.

## Stop conditions
Escalate when business definitions conflict, ownership is unclear, source semantics cannot be established, or a breaking contract change requires consumer coordination.