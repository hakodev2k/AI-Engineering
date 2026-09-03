# Developer SDK and Contracts

## Purpose
Design maintainable client SDKs and contracts that let application teams adopt platform AI capabilities with low friction while preserving explicit behavior and compatibility.

## When to use
Use when many teams integrate the same gateway, evaluation, prompt registry, retrieval, or model-service APIs.

## Inputs
- Platform API contracts
- Supported languages and runtimes
- Authentication model
- Error semantics
- Versioning policy

## Context to inspect
Inspect duplicated client code, onboarding documentation, application runtime versions, retry implementations, telemetry propagation, API compatibility history, and support requests.

## Core knowledge
SDKs should simplify repetitive protocol work without concealing important model semantics. They need semantic versioning, cancellation, streaming, timeouts, structured errors, telemetry hooks, and clear compatibility guarantees. Generated clients are useful when schemas are stable but often require ergonomic wrappers.

## Procedure
1. Identify repetitive integration tasks suitable for the SDK.
2. Keep business logic and model-selection policy out of generic clients unless explicitly owned by the platform.
3. Define typed request, response, and error contracts.
4. Implement authentication using platform-approved identity mechanisms.
5. Preserve streaming, cancellation, and timeout controls.
6. Expose request identifiers and usage metadata.
7. Define retry defaults conservatively and allow override.
8. Provide local testing and mock/fake interfaces.
9. Establish compatibility and deprecation policy.
10. Add contract tests against the live platform API.
11. Publish minimal examples for common workloads.
12. Measure adoption friction and breaking-change frequency.

## Decision points
Generate low-level clients from schemas when practical; add hand-written ergonomic layers only where they create durable value. Prefer explicit configuration over hidden defaults for cost- or quality-sensitive behavior.

## Common failure patterns
SDKs that silently retry expensive calls, hide model versions, diverge by language, bundle application policy, break streaming, or lag behind the platform API.

## Verification
Verify contract tests, supported runtime matrices, streaming, cancellation, auth, error mapping, telemetry propagation, and upgrade compatibility.

## Expected output
Versioned SDKs with stable contracts, concise examples, conformance tests, and documented compatibility guarantees.

## Stop conditions
Stop when the underlying API contract is too unstable to support version guarantees or a proposed SDK abstraction would hide safety-critical semantics.