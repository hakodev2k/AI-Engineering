# Retries, Dead Letters, and Recovery

## Purpose
Recover transient and permanent processing failures without retry storms, silent loss, or poisoned partitions.

## When to use
Use when designing consumer error handling or investigating repeated failures.

## Inputs
Failure classes, retryability, event identity, side effects, SLOs, operator workflow.

## Context to inspect
Current retry topics/queues, DLQ, offset policy, alerts, replay tooling, idempotency.

## Core knowledge
Retries require bounded attempts, exponential backoff with jitter, and classification. DLQs are operational holding areas, not permanent data sinks.

## Procedure
1. Classify transient, permanent, and data-quality failures.
2. Define retry budget and backoff.
3. Ensure idempotent reprocessing.
4. Isolate poison events without blocking healthy traffic.
5. Preserve original payload and diagnostic metadata securely.
6. Alert on DLQ growth and retry exhaustion.
7. Define triage, correction, replay, and audit procedure.
8. Test dependency outages and poison records.

## Decision points
Retry only plausibly transient failures. Route invalid data to quarantine/DLQ when correction is possible; reject immediately when policy requires.

## Common failure patterns
Infinite retries; immediate retry loops; DLQ without ownership; losing original event metadata; replaying fixed events non-idempotently.

## Verification
Failure tests demonstrate bounded retries, healthy-flow progress, actionable diagnostics, and successful controlled replay.

## Expected output
Retry matrix, DLQ contract, alerts, and recovery runbook.

## Stop conditions
Stop if failure ownership or safe replay semantics are undefined.