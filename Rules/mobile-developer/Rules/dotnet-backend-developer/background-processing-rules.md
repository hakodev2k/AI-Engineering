# Background Processing Rules

## Purpose
Ensure background work is reliable, observable, idempotent where required, and safe during retries and shutdown.

## Scope
Applies to hosted services, queues, schedulers, Hangfire-style jobs, workers, and asynchronous processing.

## MUST
- Every job MUST define ownership, trigger, retry behavior, timeout, failure handling, and completion semantics.
- Side-effecting jobs that may execute more than once MUST be idempotent or use deduplication/transactional safeguards.
- Cancellation and graceful shutdown MUST be handled for long-running work.
- Poison or repeatedly failing work MUST have a bounded retry policy and escalation/dead-letter path.
- Job progress and terminal failures MUST be observable.
- Concurrency MUST be bounded when downstream systems or shared resources can saturate.

## MUST NOT
- MUST NOT retry indefinitely.
- MUST NOT treat enqueue success as business completion.
- MUST NOT hide permanent failures behind repeated transient retries.
- MUST NOT execute irreversible side effects before required validation/authorization.

## SHOULD
- Separate scheduling from execution logic.
- Prefer durable queues for work that must survive process restarts.

## Exceptions
At-most-once or best-effort jobs require explicit business acceptance of loss/duplication risk.

## Verification
Use duplicate-delivery tests, retry tests, shutdown tests, failure injection, queue/job metrics, and end-to-end verification.