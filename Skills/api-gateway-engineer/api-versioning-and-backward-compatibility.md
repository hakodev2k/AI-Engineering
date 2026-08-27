# API Versioning and Backward Compatibility

## Purpose
Manage route and contract evolution without breaking existing clients or accumulating unmanaged legacy paths.

## When to use
Use when introducing breaking API changes, deprecating routes, or supporting multiple contract generations.

## Inputs
Current contracts, client inventory, compatibility policy, deprecation timeline, telemetry.

## Context to inspect
Versioning conventions, route usage, consumer ownership, transformation rules, SDK dependencies, error contracts.

## Core knowledge
Understand additive versus breaking changes, URI/header/media-type versioning, deprecation signaling, compatibility adapters, and consumer-driven migration.

## Procedure
1. Classify the proposed change as compatible or breaking.
2. Prefer additive evolution where semantics remain clear.
3. Choose a versioning mechanism consistent with existing APIs.
4. Keep routing rules explicit and non-overlapping.
5. Instrument version usage by consumer class.
6. Publish deprecation and sunset milestones.
7. Provide migration evidence and rollback path.
8. Remove obsolete versions only after usage and contractual gates are satisfied.

## Decision points
Do not create a new version for every additive change. Use gateway adapters for bounded migration windows, not indefinite divergence.

## Common failure patterns
Silent semantic changes, version sprawl, deprecation without usage telemetry, deleting routes before clients migrate, inconsistent error behavior.

## Verification
Contract tests pass for all supported versions; production telemetry proves migration progress and no unexpected consumers.

## Expected output
A controlled compatibility plan with explicit lifecycle and routing behavior.

## Stop conditions
Escalate when unknown external clients may depend on the old contract.