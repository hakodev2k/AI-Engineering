# Data Contracts and Schema Evolution

## Purpose
Establish enforceable producer-consumer contracts that allow data structures and semantics to evolve without uncontrolled downstream breakage.

## When to use
Use for shared datasets, events, APIs feeding analytics, and any interface with multiple independent owners.

## Inputs
Current schemas, semantic definitions, producer/consumer inventory, compatibility requirements, SLAs, and governance policies.

## Context to inspect
Schema registry/catalog, transformation code, consumer queries, deployment cadence, historical breaking changes, and ownership metadata.

## Core knowledge
A schema is only part of a contract; semantics, keys, nullability, freshness, quality, deletion, and compatibility matter. Additive changes can still be semantically breaking. Compatibility must be evaluated against real consumers.

## Procedure
1. Identify producer and accountable consumers.
2. Define field semantics, keys, units, nullability, timestamps, and lifecycle.
3. Select compatibility policy appropriate to serialization and deployment order.
4. Version contracts deliberately; avoid versioning every harmless change.
5. Automate structural checks in CI and publication paths.
6. Add semantic and quality assertions where structure is insufficient.
7. Define deprecation windows and consumer migration signals.
8. Capture ownership and escalation routes.
9. Test representative old/new producer-consumer combinations.
10. Monitor contract violations and deprecated usage.

## Decision points
Prefer backward-compatible evolution when consumers upgrade independently. Introduce a new version when semantics change materially or compatibility would create confusing dual meaning. Strict contracts suit critical shared interfaces; exploratory data may use lighter governance.

## Common failure patterns
Schema-only contracts, undocumented semantic changes, field reuse, silent type widening, removing fields before usage is measured, and registries without enforcement.

## Verification
Run compatibility tests, validate contract checks reject known breaking changes, inventory remaining deprecated consumers, and reconcile documented semantics with sampled data.

## Expected output
Versioned contract, compatibility policy, automated checks, deprecation plan, ownership, and violation telemetry.

## Stop conditions
Escalate when ownership is unknown, consumers cannot be enumerated for a breaking change, or legal/semantic definitions are disputed.