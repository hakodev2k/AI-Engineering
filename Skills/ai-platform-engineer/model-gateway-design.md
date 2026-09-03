# Model Gateway Design

## Purpose
Design a production model gateway that centralizes authentication, policy, routing hooks, telemetry, quotas, and provider error handling while preserving model semantics.

## When to use
Use when many applications call external or self-hosted models and duplicated integration logic creates security, reliability, or observability problems.

## Inputs
- Consumer traffic profiles
- Provider APIs and limits
- Identity model
- Routing and policy requirements
- SLOs and cost targets

## Context to inspect
Inspect current SDKs, network paths, retries, timeout settings, streaming behavior, headers, payload limits, rate limits, and provider-specific features.

## Core knowledge
A gateway belongs on the critical data path. Added features increase latency and blast radius. It must preserve streaming, cancellation, usage metadata, error semantics, and request isolation. Retries must account for idempotency and provider charging behavior.

## Procedure
1. Define gateway responsibilities and explicit non-responsibilities.
2. Specify request and response contracts.
3. Preserve streaming and cancellation semantics.
4. Integrate workload identity and tenant authorization.
5. Enforce quotas and payload limits.
6. Normalize only errors useful to consumers while retaining provider detail internally.
7. Define timeouts and retry eligibility.
8. Add trace correlation and usage accounting.
9. Design high-availability deployment and overload behavior.
10. Add compatibility tests against supported providers.
11. Load-test representative payloads and streaming workloads.
12. Document bypass and emergency procedures.

## Decision points
Keep the gateway thin unless central enforcement justifies complexity. Use provider-native paths for features that cannot be represented safely. Fail fast rather than queue indefinitely under overload.

## Common failure patterns
Gateway becoming a monolith, retry storms, broken streaming, hidden truncation, loss of provider errors, unbounded payloads, and gateway outages taking down every AI product.

## Verification
Verify contract conformance, latency overhead, throughput, streaming, cancellation, quotas, auth boundaries, failover, overload, and provider error propagation with integration and load tests.

## Expected output
A reviewed gateway architecture plus measurable operational controls and compatibility tests.

## Stop conditions
Stop if mandatory gateway behavior cannot preserve required provider semantics or the design introduces an unacceptable single point of failure.