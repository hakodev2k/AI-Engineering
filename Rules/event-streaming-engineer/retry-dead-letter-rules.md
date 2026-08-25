# Retry and Dead-Letter Rules

## Purpose
Recover transient failures without creating retry storms, hidden data loss, or permanently stuck partitions.

## Scope
Applies to local retries, delayed retries, retry topics/queues, poison events, and dead-letter handling.

## MUST
- Retries MUST distinguish transient from permanent or validation failures where practical.
- Retry policies MUST define maximum attempts, delay/backoff, jitter where appropriate, and terminal handling.
- Retried operations MUST preserve idempotency requirements.
- Dead-letter records MUST retain enough original identity and diagnostic context for safe investigation without leaking secrets.
- Dead-letter accumulation and retry exhaustion MUST be monitored with actionable ownership.

## MUST NOT
- MUST NOT retry indefinitely without an explicit bounded operational strategy.
- MUST NOT create tight retry loops capable of amplifying an outage.
- MUST NOT silently discard poison events.
- MUST NOT replay dead-letter data into production without validating the corrective condition and blast radius.

## SHOULD
- Partition-blocking retries SHOULD be avoided when independent events can safely progress.
- Dead-letter replay tooling SHOULD support bounded selection, dry-run validation, rate limiting, and audit records.

## Exceptions
Unbounded retry is permitted only for explicitly approved workflows with durable backpressure, no harmful amplification, and operational escape controls.

## Verification
Fault-test transient/permanent errors, inspect retry timing, validate dead-letter payloads, alert thresholds, and controlled replay behavior.