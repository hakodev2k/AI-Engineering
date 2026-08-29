# API and SDK Evaluation

## Purpose
Evaluate whether APIs and SDKs meet integration, lifecycle, reliability, security, and developer-experience requirements.

## When to use
Use during platform selection, POCs, migration planning, and integration reviews.

## Inputs
API/SDK documentation, sample code, requirements, supported runtimes, authentication model, limits, version policy.

## Context to inspect
Error models, pagination, retries, timeouts, idempotency, rate limits, compatibility, release cadence, telemetry, and support lifecycle.

## Core knowledge
A successful hello-world proves little about production fitness. Senior evaluation examines failure semantics, contract stability, operational behavior, and upgrade burden.

## Procedure
1. Map required use cases to supported operations.
2. Validate authentication and permission granularity.
3. Exercise success and failure paths.
4. Test limits, pagination, concurrency, and timeouts.
5. Inspect dependency footprint and runtime compatibility.
6. Review versioning and deprecation policy.
7. Measure observability and diagnosability.
8. Document gaps and workarounds.

## Decision points
Prefer SDKs when they reduce safe integration cost without obscuring critical behavior; use direct APIs when control or portability dominates.

## Common failure patterns
Evaluating only happy paths, ignoring rate limits, depending on undocumented behavior, and accepting opaque retry logic.

## Verification
Representative calls and failure cases are executed and compatibility assumptions are evidenced.

## Expected output
A production-readiness assessment with risks and recommendations.

## Stop conditions
Stop when required documentation, supported versions, or test access is unavailable.