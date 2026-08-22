# Data Requirements Analysis

## Purpose
Define what business data is needed, how it is interpreted, validated, owned, retained, and exchanged.

## When to use
Use for new features, reports, integrations, migrations, data-quality issues, or any change affecting business information.

## Inputs
Business processes, domain terminology, source systems, reports, APIs, data models, policies, and sample records.

## Preconditions
Business outcomes and relevant data sources are identifiable.

## Context to inspect
Data definitions, ownership, source of truth, lifecycle, quality issues, sensitivity, lineage, reference data, and downstream consumers.

## Core knowledge
A Senior BA distinguishes business meaning from physical schema and prevents teams from using the same term for different concepts or different terms for the same concept.

## Procedure
1. Identify information needed to support each business outcome.
2. Define business entities, attributes, and relationships.
3. Establish authoritative terminology and definitions.
4. Identify systems of record and ownership.
5. Capture validation, completeness, uniqueness, and timeliness rules.
6. Identify sensitive or regulated fields.
7. Document transformation and derivation rules.
8. Capture retention and lifecycle expectations.
9. Validate examples with domain experts and data owners.
10. Trace data requirements to processes, interfaces, and acceptance criteria.

## Decision points
Use conceptual models for business alignment; add logical detail when relationships, transformations, or integration mappings need precision.

## Common failure patterns
Copying database columns as requirements, ignoring data ownership, using ambiguous definitions, and overlooking quality or lifecycle rules.

## Verification
Confirm business definitions are agreed, required data has a source and owner, and representative records satisfy validation rules.

## Expected output
A business-oriented data specification with definitions, ownership, rules, lineage, sensitivity, and traceability.

## Stop conditions
Escalate when no authoritative source or owner can resolve conflicting definitions.