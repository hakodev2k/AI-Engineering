# Data Contract Governance

## Purpose
Govern producer-consumer data contracts so schema, semantics, quality, compatibility, and service expectations evolve safely.

## When to use
Use for shared datasets, events, APIs, data products, high-change pipelines, or recurring downstream breakage.

## Inputs
Schemas, consumers, SLOs, definitions, quality rules, version history, lineage, deployment workflows.

## Context to inspect
Inspect producer ownership, consumer dependencies, compatibility guarantees, incidents, registries/catalogs, and CI/CD controls.

## Core knowledge
A useful contract covers structure, semantics, ownership, quality, availability, change policy, and deprecation. Contracts should be machine-testable where possible and proportionate to dependency risk.

## Procedure
1. Identify material producer-consumer boundaries.
2. Document consumers and dependency criticality.
3. Define schema and semantic expectations.
4. Define quality and service-level expectations.
5. Specify compatibility and versioning rules.
6. Assign producer and consumer responsibilities.
7. Implement automated validation in delivery pipelines.
8. Define change notification and deprecation windows.
9. Establish exception and emergency-change paths.
10. Monitor violations and consumer impact.
11. Review contracts as usage changes.

## Decision points
Require stronger compatibility for broad/high-criticality consumers. Version when breaking change is unavoidable; avoid indefinite obsolete-version support.

## Common failure patterns
Schema-only contracts, undocumented consumers, breaking changes without notice, unenforced SLOs, contracts detached from CI, and permanent legacy versions.

## Verification
Execute compatibility tests, simulate representative changes, verify notification/deprecation workflows, and confirm consumers can detect violations.

## Expected output
Versioned contract with semantics, schema, quality, service levels, ownership, compatibility, and lifecycle rules.

## Stop conditions
Escalate unavoidable breaking changes without migration agreement or conflicting expectations for critical consumers.