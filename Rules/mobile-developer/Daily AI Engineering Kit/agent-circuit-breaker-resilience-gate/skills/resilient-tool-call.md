# Resilient Tool Call Skill

## Purpose
Execute external API/tool calls with bounded retries, idempotency checks, timeout discipline, and circuit-breaker protection.

## When to use
Use for network APIs, MCP tools, SaaS integrations, webhooks, remote build/test services, and other failure-prone external dependencies.

## Inputs
Operation, target service, idempotency classification, timeout, attempt count, latest status/error kind, optional Retry-After, and current circuit state.

## Preconditions
The operation is understood well enough to classify side effects. Credentials and permissions already exist. The agent is not authorized to broaden them.

## Process
1. Identify whether the operation is read-only, naturally idempotent, idempotent via key/token, or non-idempotent.
2. Refuse automatic retry for non-idempotent calls unless an explicit idempotency mechanism exists.
3. Enforce the configured operation timeout.
4. After failure, classify the failure using `scripts/resilience_gate.py`.
5. `retry`: preserve evidence, wait for the returned bounded delay, retry only if the circuit permits and the attempt budget remains.
6. `approval`: stop automatic execution and request human approval rather than guessing that retry is safe.
7. `stop`: preserve status/error/timing and return the failure to the workflow.
8. Record each attempt without secrets or sensitive payloads.
9. On success, verify the expected response/postcondition rather than treating transport success alone as completion.

## Verification
- Attempt count does not exceed policy.
- Retryable vs non-retryable classification is evidence-backed.
- Non-idempotent operations are not silently retried.
- Circuit-open state blocks calls.
- Successful operation has a verified postcondition.

## Failure handling
Retryable transient failures get at most the configured attempts. Policy/tool failures stop immediately. Repeated failures open the circuit. Permission/auth failures are non-retryable by default.

## Stop conditions
Attempt budget exhausted, circuit open, non-retryable error, unknown side effects, missing idempotency guarantee, or required human approval.
