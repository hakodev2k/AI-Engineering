# Serverless and Event-Driven Architecture Rules

## Purpose
Design serverless and event-driven cloud workloads with explicit delivery semantics, failure handling, concurrency controls, and operational ownership.

## Scope
Applies to functions, managed event buses, queues, topics, triggers, workflows, and asynchronous service integration.

## MUST
- Event contracts MUST define schema, ownership, compatibility expectations, delivery semantics, and failure handling.
- Consumers MUST be designed for duplicate delivery when the platform can redeliver messages.
- Retry, dead-letter, timeout, concurrency, and backpressure behavior MUST be configured intentionally for critical flows.
- Serverless workloads MUST evaluate cold-start, execution-limit, quota, state, networking, observability, and cost implications against requirements.
- Poison messages and permanently failing events MUST have an inspectable quarantine or remediation path.

## MUST NOT
- MUST NOT assume exactly-once business processing solely from broker or function marketing guarantees.
- MUST NOT create unbounded event fan-out or concurrency that can overwhelm downstream dependencies.
- MUST NOT discard failed events silently.

## SHOULD
- Prefer idempotent handlers and immutable events.
- Keep event schemas backward compatible where independent deployment is required.

## Exceptions
Exceptions require documented semantics, failure risk, compensating controls, and verification evidence.

## Verification
Inspect schemas, retry policies, dead-letter configuration, idempotency tests, concurrency limits, failure tests, traces, and event-processing metrics.