# Idempotency and Retry Safety

## Purpose
Make API operations safe under duplicate delivery, client retries, network ambiguity, and transient failures.

## When to use
Use for payments, provisioning, order creation, webhook handling, and other side-effecting operations likely to be retried.

## Inputs
Operation semantics, retry sources, persistence model, idempotency window, and failure modes.

## Context to inspect
Client retry policies, gateways, queues, database constraints, transaction boundaries, and duplicate-event behavior.

## Core knowledge
Retries can duplicate side effects. Idempotency requires a stable operation identity, atomic recording of outcome, and deterministic replay behavior.

## Procedure
1. Identify retry and duplicate scenarios.
2. Classify naturally idempotent operations.
3. Define an idempotency key scope and lifetime.
4. Persist key, request fingerprint, and outcome atomically where needed.
5. Reject key reuse with incompatible payloads.
6. Return prior outcome for valid replays.
7. Bound storage and cleanup safely.
8. Test timeout-before-response and concurrent duplicate requests.

## Decision points
Prefer database uniqueness when a natural business key exists; use explicit idempotency records when operation identity is client-defined.

## Common failure patterns
Retrying non-idempotent POST blindly, storing keys after side effects, ignoring concurrent duplicates, and unlimited key retention.

## Verification
Concurrency and fault-injection tests prove one logical side effect for repeated requests.

## Expected output
A documented and tested retry-safe operation.

## Stop conditions
Escalate if atomicity cannot be guaranteed for irreversible side effects.