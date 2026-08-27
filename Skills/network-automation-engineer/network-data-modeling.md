# Network Data Modeling

## Purpose
Model network intent in reusable schemas that decouple business requirements from vendor syntax.

## When to use
Use when creating automation inputs, templates, APIs, validation, or multi-vendor abstractions.

## Inputs
Network services, topology, addressing, device roles, platform capabilities, standards, and existing configuration conventions.

## Context to inspect
Current schemas, templates, YANG/OpenConfig models, controller APIs, and vendor-specific exceptions.

## Core knowledge
A good model captures intent, constraints, relationships, defaults, and lifecycle without leaking unnecessary CLI structure. Versioning and backward compatibility matter.

## Procedure
1. Identify stable business/network concepts.
2. Separate intent from rendered implementation.
3. Define types, required fields, enums, relationships, and invariants.
4. Represent optional capabilities explicitly.
5. Add schema validation and semantic cross-field checks.
6. Version models deliberately.
7. Map model fields to each supported platform.
8. Test representative and edge-case services.
9. Document defaults and unsupported combinations.
10. Evolve through compatibility-aware migrations.

## Decision points
Use standard models when they fit; extend rather than fork when practical. Keep vendor-specific knobs in bounded extensions.

## Common failure patterns
CLI-shaped schemas, untyped free-form fields, hidden defaults, breaking changes without migration, and one giant model for unrelated services.

## Verification
Validate sample datasets, render across supported platforms, round-trip observed state where applicable, and run compatibility tests.

## Expected output
Versioned schema, semantic validators, platform mappings, examples, and migration rules.

## Stop conditions
Escalate when required intent cannot be represented without ambiguous semantics or unsupported platform behavior.