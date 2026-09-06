# SDK Architecture and Design

## Purpose
Design maintainable SDKs that translate a platform contract into idiomatic, predictable developer workflows without obscuring important behavior.

## When to use
Use when building or restructuring official SDKs, adding major API coverage, or correcting cross-language inconsistency.

## Inputs
API schemas, target languages, language-version support policy, authentication model, retries, streaming behavior, examples, release policy, and compatibility requirements.

## Context to inspect
Inspect existing SDK conventions, package layout, generated code, transport layer, models, error hierarchy, async support, test infrastructure, package metadata, and user-reported pain points.

## Core knowledge
A strong SDK is not merely a thin wrapper. It should be idiomatic, explicit about network behavior, easy to configure, testable, and resilient to API evolution. Generated code can reduce drift but often requires a stable handwritten layer for ergonomics and compatibility.

## Procedure
1. Identify primary workflows and language-specific expectations.
2. Separate transport, generated schema, public client surface, and convenience helpers.
3. Define configuration, authentication, timeouts, retries, proxies, and user-agent behavior.
4. Design synchronous and asynchronous surfaces where appropriate.
5. Define streaming iteration and cancellation semantics.
6. Map platform errors into a stable SDK error hierarchy.
7. Preserve response metadata needed for debugging and rate-limit handling.
8. Minimize hidden global state.
9. Add examples for common and advanced workflows.
10. Add unit, integration, and compatibility tests.
11. Review packaging, semantic versioning, and deprecation strategy.
12. Validate ergonomics with a fresh sample project.

## Decision points
Generate repetitive schema code when it lowers drift; handwrite workflow-level ergonomics. Add convenience helpers only when they preserve access to underlying controls. Follow native language patterns even when SDKs differ cosmetically across languages.

## Common failure patterns
Over-wrapping the API, hiding response metadata, inconsistent sync/async behavior, global mutable configuration, unbounded retries, generated public APIs that are awkward to use, and language SDKs drifting semantically.

## Verification
Install the package into a clean project, run representative workflows, inject transport failures, verify retries and cancellation, run cross-version compatibility tests, and compare behavior with the documented API contract.

## Expected output
An SDK architecture with stable public interfaces, test coverage, examples, release guidance, and documented trade-offs.

## Stop conditions
Stop when API semantics are unresolved, supported runtime versions are undefined, a required behavior cannot be represented safely in the target language, or a breaking SDK change lacks migration approval.