# Resilience Fallback and Failure Injection

## Purpose
Verify that AI applications fail predictably and recover safely when models, retrieval systems, tools, networks, or dependencies become slow, unavailable, or inconsistent.

## When to use
Use for production AI systems with external model providers, tools, queues, vector stores, or multi-stage workflows.

## Inputs
Architecture, dependency map, timeout/retry configuration, fallback policies, SLOs, failure scenarios, and observability.

## Preconditions
Failure injection can be performed in a safe non-production environment or controlled production experiment.

## Context to inspect
Inspect timeouts, retries, circuit breakers, queues, fallback models, caches, idempotency, user messaging, and incident telemetry.

## Core knowledge
Retries are not resilience unless bounded and appropriate. AI calls can be expensive, slow, and non-idempotent when tied to tools. Partial failure must preserve state and avoid duplicate side effects.

## Procedure
1. Map critical dependencies and expected failure behavior.
2. Inject timeouts, connection failures, 429s, 5xx responses, malformed payloads, and partial tool failures.
3. Verify timeout budgets across nested calls.
4. Confirm retries use bounded backoff and respect idempotency.
5. Test circuit breakers and overload protection.
6. Exercise fallback model or degraded-mode behavior.
7. Verify user-facing errors are accurate and actionable.
8. Check that state and side effects remain consistent after partial failure.
9. Verify alerts and traces expose the failing dependency.
10. Repeat under representative concurrency.

## Decision points
Retry transient failures only when the operation is safe to repeat. Prefer graceful degradation over fallback when a weaker model would violate quality or safety requirements.

## Common failure patterns
Retry storms, hidden duplicate tool actions, fallback loops, excessively long timeout chains, silent quality degradation, and missing dependency attribution.

## Verification
Confirm each injected failure reaches the intended bounded outcome and observability identifies the failure path.

## Expected output
A resilience test report with failure matrix, recovery behavior, fallback evidence, and remediation items.

## Stop conditions
Stop when fault injection could cause uncontrolled external side effects or required rollback controls are unavailable.