# Event Contract Design

## Purpose
Create durable event contracts that consumers can safely integrate with and evolve over time.

## When to use
Use for new event schemas, contract reviews, or breaking-change prevention.

## Inputs
Event semantics, consumer needs, schema technology, compatibility policy, data classification.

## Context to inspect
Existing naming conventions, schema registry, serializers, consumer languages, retention/replay policy, and prior versions.

## Core knowledge
A contract includes semantics, not just fields. Stable identifiers, timestamps, provenance, correlation metadata, units, nullability, and enum behavior matter. Compatibility depends on serializer and consumer assumptions.

## Procedure
1. State the event's business meaning and invariants.
2. Define envelope versus domain payload.
3. Add globally useful identifiers and occurrence time.
4. Use explicit types, units, nullability, and bounded values.
5. Include only data justified by consumers and replay needs.
6. Define unknown-field and unknown-enum behavior.
7. Check backward/forward compatibility rules.
8. Validate privacy, tenancy, and retention implications.
9. Publish machine-readable schema where supported.
10. Add producer and consumer contract tests.

## Decision points
Embed data when consumers need historical truth independent of later source changes; reference data when size, sensitivity, or freshness makes embedding unsafe. Prefer additive evolution over mutation.

## Common failure patterns
Reusing database models, optional fields with unclear semantics, local timestamps, unstable identifiers, undocumented defaults, removing fields prematurely, and schema changes without consumer evidence.

## Verification
Run compatibility checks against registered versions, deserialize with representative consumers, test old and new payloads, and verify documented semantics match producer behavior.

## Expected output
A versioned, documented, testable event contract with compatibility guarantees.

## Stop conditions
Stop if event meaning is ambiguous, required sensitive data lacks approval, or compatibility cannot be demonstrated.