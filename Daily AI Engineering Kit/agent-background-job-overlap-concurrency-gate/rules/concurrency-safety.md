# Rules: Background Job Concurrency Safety

## MUST
- Identify every trigger and retry path before declaring a job concurrency-safe.
- Treat any external side effect as non-idempotent until the deduplication mechanism is evidenced.
- Use a cross-instance coordination mechanism when singleton execution must hold across multiple application instances.
- Define finite acquisition timeout, lease lifetime, ownership, and stale-lock recovery for distributed locks.
- Preserve the same logical idempotency key across retries of the same operation.
- Verify concurrent execution behavior with deterministic tests or equivalent runtime evidence.
- Inspect the final diff for scheduler, retry, transaction, and side-effect changes.
- Stop before any action listed in `config/policy.json` as approval-required.

## MUST NOT
- Do not use an in-process mutex as proof of global serialization in a multi-instance deployment.
- Do not release a distributed lease without verifying ownership.
- Do not set an infinite lock wait or an unbounded retry loop.
- Do not suppress duplicate effects by catching and ignoring exceptions.
- Do not shorten a schedule interval without reassessing maximum job duration and overlap behavior.
- Do not disable production jobs, alter production schedules, change schemas, or delete data without explicit human approval.
- Do not log secrets, connection strings, tokens, or full sensitive payloads while collecting evidence.
- Do not claim a scanner candidate is a confirmed defect without corroborating context.

## SHOULD
- Prefer database uniqueness/atomic state transitions for business invariants and locks for execution coordination.
- Prefer idempotent side effects even when serialization already exists.
- Record job identity, attempt identity, logical operation identity, lock owner, and correlation ID in structured telemetry.
- Test crash/timeout/retry paths in addition to the happy path.
- Keep lock scope as narrow as correctness permits while covering all unsafe side effects.
