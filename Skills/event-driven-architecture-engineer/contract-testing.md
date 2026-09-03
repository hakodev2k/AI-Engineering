# Event Contract Testing

## Purpose
Detect producer-consumer incompatibilities before deployment.

## When to use
Use for schema changes, new consumers, serializer upgrades, and CI quality gates.

## Inputs
Schemas, producer fixtures, consumer expectations, compatibility rules, historical payload samples.

## Context to inspect
Registry, generated models, serialization settings, CI pipeline, deployed versions, and semantic invariants.

## Core knowledge
Schema compatibility checks catch structural changes but not all semantic breaks. Contract tests should cover serialization plus meaning-critical invariants and representative historical payloads.

## Procedure
1. Identify producer and consumer contract boundaries.
2. Collect canonical valid and invalid examples.
3. Test producer output against registered schema.
4. Test consumer deserialization of current and retained versions.
5. Assert semantic invariants such as units, identifiers, null behavior, and enum handling.
6. Add compatibility checks to CI.
7. Test unknown fields and future enum values where format permits.
8. Fail releases on incompatible changes unless an approved migration exists.

## Decision points
Use registry compatibility as a baseline; add consumer-driven tests when consumers have stricter semantic requirements. Avoid coupling tests to internal producer implementation.

## Common failure patterns
Testing only happy-path JSON, snapshot tests without semantic assertions, no old-version fixtures, and treating generated code compilation as proof of compatibility.

## Verification
CI rejects known breaking mutations and accepts compatible additive evolution; representative producer/consumer versions interoperate.

## Expected output
Automated contract tests and compatibility gates tied to event versions.

## Stop conditions
Stop when contract ownership or supported version window is undefined.