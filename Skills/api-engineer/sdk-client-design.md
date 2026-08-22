# SDK and API Client Design

## Purpose
Design client libraries that make API contracts easy to use while preserving protocol semantics and operational control.

## When to use
Use for public/shared APIs that provide generated or maintained SDKs.

## Inputs
API contract, target languages, consumer workflows, authentication model, and compatibility policy.

## Context to inspect
OpenAPI generation, HTTP stack, retries, serialization, pagination, errors, and release/versioning process.

## Core knowledge
SDKs should reduce boilerplate without hiding important failures. Consumers need control over timeouts, cancellation, base URLs, credentials, and telemetry.

## Procedure
1. Identify common consumer workflows.
2. Map contract operations to idiomatic language APIs.
3. Centralize transport configuration.
4. Expose cancellation and timeout controls.
5. Model typed errors and pagination.
6. Avoid unsafe automatic retries.
7. Preserve forward compatibility for additive fields.
8. Add usage examples and tests.
9. Version SDKs consistently with compatibility policy.
10. Test against a real provider contract.

## Decision points
Generate repetitive models/clients when schema quality is high; handcraft higher-level convenience layers only when they add stable consumer value.

## Common failure patterns
Hard-coded endpoints, hidden retries, swallowed HTTP detail, global mutable clients, and SDK releases drifting from API contracts.

## Verification
SDK integration tests cover authentication, errors, pagination, cancellation, and compatibility with the deployed API.

## Expected output
An idiomatic, configurable, contract-aligned client library.

## Stop conditions
Stop if the underlying API contract is unstable or undocumented.