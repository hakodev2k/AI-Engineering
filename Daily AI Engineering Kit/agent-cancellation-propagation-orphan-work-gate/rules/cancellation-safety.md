# Cancellation Safety Rules

## MUST
- Propagate the caller's cancellation/abort signal to every API that natively accepts it unless a documented lifecycle boundary intentionally ends propagation.
- Check cancellation between retry attempts and before retry delay.
- Treat cancellation as a distinct terminal outcome, not success.
- Bound cleanup time and preserve original cancellation evidence.
- Give intentionally detached work an explicit owner, durable handoff, and idempotency strategy.
- Record evidence for every suppression produced by the static gate.
- Require human approval before production deployment, destructive cleanup, schema changes, breaking contracts, secret/config changes, infrastructure changes, or weakened cancellation controls.

## MUST NOT
- Start unowned fire-and-forget business work from a request-scoped/agent-scoped lifetime.
- Catch cancellation and continue normal business execution.
- Replace a propagated cancellation signal with a fresh never-cancelled signal merely to avoid failure.
- Retry a cancelled operation as if it were transient.
- Increase permissions or disable safeguards to make cancellation tests pass.
- Force push or rewrite Git history.

## SHOULD
- Prefer structured concurrency where the framework supports it.
- Pass cancellation explicitly across service boundaries that support cooperative cancellation.
- Use idempotency for remote side effects that may complete concurrently with cancellation.
- Test cancellation under fan-out, retries, and slow I/O.
- Keep cancellation-specific logs concise and correlation-friendly.