# Queue Safety Rules

## MUST
- Preserve the original message ID, correlation ID, schema version, attempt count, timestamps, routing metadata, and failure evidence during investigation.
- Redact secrets and sensitive fields before persisting payload evidence.
- Enforce a finite delivery-attempt limit; the default package limit is 5 attempts.
- Quarantine deterministic poison messages instead of retrying them indefinitely.
- Prove idempotency or duplicate-side-effect protection before any production replay.
- Require explicit human approval before replaying, deleting, purging, modifying, or rerouting production messages.
- Keep production triage read-only unless an approved replay action is being executed.
- Record the exact fix/build/schema used when verifying a replay candidate.

## MUST NOT
- Do not purge a DLQ to make monitoring green.
- Do not reset delivery counters to bypass retry policy.
- Do not replay an entire DLQ before a single-message verification succeeds.
- Do not mutate message bodies to make them pass unless an approved data-remediation process explicitly requires it.
- Do not log unredacted authentication tokens, passwords, connection strings, or authorization headers.
- Do not treat repeated deterministic validation failures as transient infrastructure failures.
- Do not widen broker or production permissions merely because investigation tools cannot mutate the queue.
- Do not acknowledge a failed message before durable handling/quarantine behavior is confirmed.

## SHOULD
- Prefer consumer/producer regression tests created from a sanitized failing envelope.
- Prefer exponential or staged backoff for transient retries.
- Track DLQ age, count, top failure class, schema version, and replay outcome as operational signals.
- Keep producer and consumer schema compatibility checks in CI where practical.
