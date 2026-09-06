# API Client SDK Strategy

## Purpose
Provide maintainable client SDKs that improve developer experience without hiding critical API semantics or creating release coupling.

## When to use
Use when consumers repeatedly implement transport/auth logic, when public APIs need supported libraries, or when generated clients are being evaluated.

## Inputs
API contracts, target languages, consumer environments, auth model, release/versioning policy.

## Context to inspect
Inspect existing SDKs, generated-code tooling, package registries, support burden, retry defaults, and compatibility requirements.

## Core knowledge
SDKs are products with their own compatibility surface. Generated transport layers reduce drift, while curated wrappers can add ergonomics, resilience, and idiomatic types. Hidden retries and magic behavior can be dangerous.

## Procedure
1. Identify high-value target ecosystems.
2. Define SDK responsibilities and non-responsibilities.
3. Select generation vs handwritten layers.
4. Standardize auth, timeouts, user-agent, errors, and telemetry hooks.
5. Make retry behavior explicit and safe.
6. Preserve access to underlying API semantics.
7. Automate generation, testing, packaging, and signing.
8. Align SDK versions with API compatibility policy without unnecessary lockstep.
9. Test against live-compatible contract fixtures.
10. Publish migration and support policy.

## Decision points
Generate repetitive protocol code; handcraft high-value ergonomic layers. Avoid SDKs when raw HTTP usage is already trivial and maintenance cost exceeds benefit.

## Common failure patterns
SDK/API drift, hidden retries, bundled credentials, breaking generated changes, and unsupported language proliferation.

## Verification
Run SDK contract tests, package installation tests, auth flows, error handling, and compatibility scenarios.

## Expected output
Supported SDKs with predictable semantics and automated release discipline.

## Stop conditions
Stop if contract stability or package ownership is insufficient for sustainable support.