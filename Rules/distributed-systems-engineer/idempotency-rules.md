# Idempotency Rules

## Purpose
Prevent duplicate effects when requests, messages, or jobs are retried.

## Scope
APIs, queues, schedulers, workflows, and external integrations.

## MUST
- Operations that may be retried MUST define duplicate-detection or idempotent semantics.
- Idempotency keys MUST have defined scope, retention, and collision behavior.
- Replayed operations MUST preserve the original outcome where contractually required.

## MUST NOT
- MUST NOT assume at-most-once delivery from infrastructure without evidence.
- MUST NOT perform irreversible side effects before duplicate protection is established.

## SHOULD
- Prefer naturally idempotent state transitions when feasible.

## Exceptions
Non-idempotent operations require documented retry prohibition and caller-visible uncertainty handling.

## Verification
Run duplicate-request, replay, timeout-after-commit, and concurrent-retry tests.