# Schema Contract Validation

## Purpose
Protect AI pipelines from breaking structural changes by validating schemas and data contracts at boundaries.

## When to use
Use when adding sources, evolving schemas, changing serialization, or consuming external datasets and events.

## Inputs
Current schema, proposed schema, producer and consumer contracts, sample records, compatibility rules.

## Preconditions
The producer-consumer boundary and authoritative schema are identifiable.

## Context to inspect
Schema registry, ingestion code, feature pipelines, training loaders, inference services, default handling, null semantics, versioning policy.

## Core knowledge
Schema compatibility includes field presence, type, range, units, enum semantics, nullability, ordering assumptions, and meaning. Syntactic compatibility does not guarantee semantic compatibility.

## Procedure
1. Compare current and proposed schemas.
2. Identify affected consumers.
3. Classify changes as additive, compatible, conditionally compatible, or breaking.
4. Validate field types, units, cardinality, and nullability.
5. Test representative historical and new records.
6. Check defaults and unknown-enum behavior.
7. Add automated contract tests.
8. Define migration or dual-read strategy for breaking changes.
9. Verify rollout order across producers and consumers.
10. Record version and ownership.

## Decision points
Prefer additive evolution where possible. Use explicit versioning when semantics change even if physical types remain compatible.

## Common failure patterns
Treating renamed fields as harmless, changing units silently, accepting new enum values without tests, and assuming nullable means optional in every consumer.

## Verification
Contract tests pass for supported versions and representative consumers process both expected and edge-case records correctly.

## Expected output
A compatibility assessment, validated schema contract, and migration plan when needed.

## Stop conditions
Stop when the meaning of changed fields is unclear or rollout cannot preserve consumer compatibility.