# Data Contracts

## Purpose
Design and govern producer-consumer contracts that make structural and semantic expectations explicit and safely evolvable.

## When to use
Use for shared datasets, event streams, APIs feeding analytics, schema evolution, and recurring producer-caused breakage.

## Inputs
Producer schema, consumer dependencies, semantics, compatibility requirements, ownership, delivery expectations, and change history.

## Preconditions
Identify authoritative producer and materially affected consumers.

## Context to inspect
Review schemas, lineage, transformations, serialization formats, null semantics, keys, units, enumerations, freshness, versioning, and deployment workflow.

## Core knowledge
A useful contract covers more than types: semantics, constraints, compatibility, ownership, and operational expectations matter. Contract evolution must distinguish additive, compatible, conditionally compatible, and breaking changes.

## Procedure
1. Identify contract boundary and consumers.
2. Document field meaning, type, nullability, units, keys, and valid domains.
3. Define freshness and delivery guarantees where relevant.
4. Mark required versus optional semantics.
5. Define compatibility policy and versioning.
6. Encode machine-testable constraints.
7. Add producer-side validation before publication.
8. Add consumer contract tests for critical assumptions.
9. Define change proposal and notification workflow.
10. Test proposed changes against known consumers.
11. Roll out compatible changes before removals.
12. Monitor violations and adoption.

## Decision points
Prefer backward-compatible evolution when multiple independent consumers exist. Version only when compatibility cannot be maintained. Enforce semantic constraints at the producer when the producer is authoritative; avoid duplicating contradictory rules downstream.

## Common failure patterns
Treating schema registry as a complete contract; undocumented units; silent enum changes; repurposing fields; deleting fields without consumer evidence; nullable fields that are operationally required; contracts with no owner.

## Verification
Run contract tests, compatibility checks, and representative consumer validations. Confirm violations are observable and breaking changes require explicit approval.

## Expected output
A versioned, machine-testable contract plus ownership, compatibility, rollout, and violation-handling rules.

## Stop conditions
Escalate when semantics conflict across consumers, no authoritative owner exists, or a breaking change lacks migration and approval.