# Quantum Backend Integration

## Purpose
Integrate quantum software with real execution backends while managing authentication, capability discovery, job submission, quotas, retries, and result retrieval safely.

## When to use
Use when moving from local simulation to cloud or on-prem quantum hardware, adding a new provider, or hardening experimental execution workflows.

## Inputs
Provider SDK, backend inventory, credentials mechanism, queue policy, shot limits, circuit constraints, and result schema.

## Context to inspect
Authentication flow, API version, supported gates, dynamic-circuit features, quotas, maintenance state, calibration metadata, job lifecycle, and provider error semantics.

## Core knowledge
Quantum backends are asynchronous, capacity constrained, and calibration dependent. Provider abstractions differ in circuit formats, job states, result objects, and error handling. Integration code should isolate provider-specific behavior behind stable project interfaces.

## Procedure
1. Inspect the project's backend abstraction and provider conventions.
2. Discover backend capabilities programmatically where possible.
3. Validate circuits before submission.
4. Keep credentials outside source code and logs.
5. Submit jobs with idempotent tracking identifiers.
6. Persist job IDs and execution metadata.
7. Handle queue, cancellation, timeout, and provider failures explicitly.
8. Retrieve raw results before post-processing.
9. Store backend and calibration metadata with results.
10. Test provider failover or simulator fallback only when semantically acceptable.

## Decision points
Use a provider abstraction when multiple backends are plausible; use direct SDK access when provider-specific features are central and abstraction would hide critical semantics.

## Common failure patterns
Hard-coded credentials, losing job IDs, infinite polling, retrying non-idempotent submissions blindly, ignoring backend capability changes, and discarding raw results.

## Verification
Submit a minimal known circuit, confirm lifecycle handling, reproduce result decoding, test timeout/failure paths, and verify metadata capture.

## Expected output
A robust backend integration with explicit provider boundaries, durable job tracking, secure configuration, and validated result handling.

## Stop conditions
Stop when credentials or permissions are unavailable, provider terms prohibit the intended use, or backend capabilities cannot satisfy circuit requirements.