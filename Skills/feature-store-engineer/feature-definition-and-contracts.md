# Feature Definition and Contracts

## Purpose
Design durable ML feature contracts so training, batch inference, and online serving interpret values identically.

## When to use
Use when adding, changing, reviewing, or deprecating a feature. Do not use to bypass domain-owner approval for semantic changes.

## Inputs
Business definition, source schema, entity keys, event timestamps, consumers, freshness and latency requirements.

## Context to inspect
Existing feature registry, naming conventions, lineage, transformation code, historical datasets, online schema, downstream models and SLAs.

## Core knowledge
A feature contract covers semantics, type, entity, event-time meaning, nullability, units, valid range, ownership, freshness, versioning and compatibility. Semantic compatibility matters more than storage compatibility.

## Procedure
1. Identify the prediction use case and entity grain.
2. Write the feature meaning independently of implementation.
3. Define source fields, event timestamp and transformation deterministically.
4. Specify type, units, null policy, valid range and freshness target.
5. Identify batch and online consumers.
6. Check for equivalent existing features before creating one.
7. Define compatibility and versioning rules.
8. Add ownership, lineage and deprecation metadata.
9. Implement contract validation at ingestion/materialization boundaries.
10. Test representative, missing, late and boundary values.
11. Review semantics with domain and model owners.

## Decision points
Reuse an existing feature only when semantics and temporal behavior match. Version rather than mutate when a change can alter model behavior or historical reproducibility.

## Common failure patterns
Ambiguous names, undocumented units, ingestion-time used as event time, silent null coercion, duplicated features, and in-place semantic changes.

## Verification
Confirm registry metadata, schema validation, temporal tests, batch/online interpretation, lineage, ownership and consumer compatibility.

## Expected output
A registered, testable feature contract with explicit semantics and lifecycle rules.

## Stop conditions
Stop when entity grain, event-time semantics, source ownership, or compatibility impact cannot be established.