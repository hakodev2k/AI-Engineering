# Queue Lease Safety Rules

## MUST
- Treat receipt handles, lock tokens, pop receipts, and equivalent ownership tokens as single-message capabilities.
- Use monotonic elapsed time for renewal scheduling.
- Renew before the configured safety margin, never after nominal expiry.
- Stop handler work and block settlement when ownership is lost or renewal is rejected.
- Bound renewal count and total lease duration.
- Require idempotency protection before side-effecting work that can be redelivered.
- Preserve delivery count, renewal attempts, ownership evidence, and final settlement outcome.
- Validate the latest provider-issued ownership token before final acknowledgement.
- Dead-letter only according to explicit policy and delivery-count evidence.
- Require explicit human approval before queue purge, destructive replay, production queue configuration changes, or deletion of dead-letter evidence.

## MUST NOT
- Acknowledge, complete, or delete a message after lease loss.
- Reuse an ownership token for a different delivery.
- Retry renewal indefinitely.
- Assume a heartbeat succeeded without checking the provider response.
- Increase production visibility timeout merely to hide slow or blocked handlers.
- Perform an irreversible side effect before idempotency protection is established.
- Purge queues or replay dead letters automatically.
- Log message payloads containing secrets or regulated data merely for lease diagnostics.

## SHOULD
- Keep the renewal threshold comfortably larger than normal network latency and transient retry delay.
- Prefer cancellation-aware handlers.
- Emit metrics for lease-lost events, renewals per message, handler duration, redeliveries, and dead-letter rate.
- Test lease behavior with intentionally slow handlers and injected renewal failures.
- Keep provider-specific adapters separate from the lease-state workflow.
