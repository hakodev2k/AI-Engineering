# Background Processing Rules

## Purpose
Ensure scheduled and asynchronous backend work is durable, bounded, observable, and safe to retry.

## Scope
Workers, schedulers, cron-like jobs, batch processes, and deferred execution.

## MUST
- Background jobs MUST have explicit ownership, retry policy, timeout, and failure handling.
- Job state that must survive process restarts MUST be durably persisted.
- Long-running jobs MUST expose progress or heartbeat signals sufficient to detect stalls.
- Job concurrency MUST be bounded according to downstream capacity.

## MUST NOT
- MUST NOT depend on in-memory fire-and-forget work for business-critical processing.
- MUST NOT retry indefinitely without escalation or dead-letter handling.
- MUST NOT execute destructive or high-risk jobs without required approval gates.

## SHOULD
- Jobs SHOULD be idempotent and resumable from safe checkpoints.
- Scheduled work SHOULD tolerate duplicate triggering.

## Exceptions
Ephemeral best-effort tasks require explicit acceptance that work may be lost on restart or failure.

## Verification
Review scheduler configuration, restart tests, duplicate-trigger tests, queue depth, worker metrics, and failure recovery.