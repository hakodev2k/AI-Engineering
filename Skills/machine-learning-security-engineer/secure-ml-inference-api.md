# Secure ML Inference API

## Purpose
Harden model-serving APIs against unauthorized use, resource abuse, malformed inputs, data leakage, and unsafe integration behavior.

## When to use
Use when designing, reviewing, or exposing online inference endpoints or gateways.

## Inputs
API contract, authentication model, authorization rules, model limits, expected traffic, latency SLOs, deployment topology, and threat model.

## Preconditions
Know consumer identities, acceptable input/output sizes, and business-critical actions downstream of predictions.

## Context to inspect
Inspect gateway, auth middleware, request parsing, preprocessing, batching, model server, output postprocessing, logs, caches, retries, and downstream actions.

## Core knowledge
Model endpoints can be computationally asymmetric: cheap requests may trigger expensive inference. Security requires conventional API controls plus model-aware quotas, payload bounds, timeout/cancellation, output minimization, and protection against extraction/probing.

## Procedure
1. Define authenticated principals and authorization scope.
2. Validate content type, schema, dimensions, size, and semantic constraints.
3. Bound batch size, sequence/image/audio dimensions, and compute-heavy options.
4. Apply identity-aware quotas and concurrency limits.
5. Set timeouts, cancellation, and backpressure.
6. Minimize sensitive output metadata and confidence precision.
7. Normalize errors to avoid internal/model leakage.
8. Protect administrative and model-management endpoints separately.
9. Design idempotency where retries can trigger side effects.
10. Log security-relevant metadata without sensitive payloads by default.
11. Add abuse detection for extraction and anomalous probing.
12. Load-test security limits and failure behavior.

## Decision points
Use synchronous serving for bounded interactive work; asynchronous jobs for expensive or long-running inference. Prefer per-identity limits over IP-only controls. Expose explanations only when product value outweighs leakage risk.

## Common failure patterns
Unlimited batch requests; unauthenticated expensive endpoints; logging raw sensitive prompts/features; retry storms; returning stack traces; trusting client-supplied model identifiers; shared admin and inference authorization.

## Verification
Test malformed and oversized inputs, unauthorized model access, quota enforcement, cancellation, overload behavior, sanitized errors, and security telemetry. Verify downstream actions cannot bypass authorization because the model suggested them.

## Expected output
A hardened inference contract with enforceable resource, identity, validation, logging, and abuse-control requirements.

## Stop conditions
Stop when consumer identity requirements are unresolved, model resource ceilings are unknown, or endpoint changes could break contractual behavior without approval.