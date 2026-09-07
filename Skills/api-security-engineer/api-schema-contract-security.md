# API Schema and Contract Security

## Purpose
Review API contracts as security boundaries so schemas constrain behavior, minimize exposure, and remain safe across version changes.

## When to use
Use for OpenAPI, JSON Schema, GraphQL schemas, protobuf contracts, new versions, partner APIs, and contract-first development.

## Inputs
Contracts, examples, compatibility requirements, data classification, consumer profiles, authorization rules, versioning policy.

## Preconditions
Know which fields are caller-controlled, server-derived, sensitive, immutable, or privileged.

## Context to inspect
Request/response models, nullable fields, defaults, enums, polymorphism, additional properties, pagination, errors, deprecations, and generated clients.

## Core knowledge
A contract should make unsafe states hard to express. Minimize writable fields, separate input and output models, constrain polymorphism, and avoid leaking internal identifiers or sensitive metadata. Backward compatibility must not preserve insecure behavior indefinitely.

## Procedure
1. Classify every field by sensitivity and mutability.
2. Separate create/update/read models where privileges differ.
3. Define explicit required fields, ranges, lengths, enums, and formats.
4. Reject dangerous ambiguous polymorphism and unexpected properties.
5. Verify response models expose only necessary data.
6. Review error schemas for leakage.
7. Map operations and fields to authorization requirements.
8. Assess versioning and deprecation security impact.
9. Generate contract tests and negative cases.
10. Verify implementation matches the published contract.

## Decision points
Prefer strict schemas for security-sensitive APIs. Allow extensibility only where consumers genuinely need forward compatibility. Use additive versioning when possible, but introduce breaking changes when required to remove unsafe semantics.

## Common failure patterns
Reusing database entities as API models, writable server-owned fields, undocumented fields, permissive additional properties, insecure defaults, overly detailed errors, and stale deprecated operations.

## Verification
Run schema validation, contract tests, field-level authorization tests, compatibility checks, and response data reviews.

## Expected output
A hardened contract with explicit constraints, minimal exposure, compatibility decisions, and verifiable security requirements.

## Stop conditions
Escalate when compatibility requirements mandate unsafe behavior, ownership of deprecated consumers is unknown, or schema generators cannot enforce required constraints.