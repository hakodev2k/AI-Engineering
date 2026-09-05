# Shutdown Safety Rules

## MUST
- Identify every source that can admit new work.
- Stop or withdraw admission before waiting for in-flight work.
- Propagate cancellation to cancellable long-running operations.
- Derive drain timeout from measured/configured maximum work duration plus margin.
- Ensure platform termination grace exceeds the drain window plus margin.
- Prove safe acknowledgement/checkpoint semantics for queue, scheduler, and background work.
- Test shutdown with work actively in flight.
- Preserve evidence and use independent verification.

## MUST NOT
- Treat process exit code 0 as proof of drain safety.
- Acknowledge queue work before the durable side effect/checkpoint required by the application's delivery contract.
- Shorten production termination grace solely to speed deployments.
- Silently convert at-least-once redelivery into potential data loss.
- Increase permissions to inspect or mutate production when read-only evidence is unavailable.
- Deploy production, change infrastructure/secrets, perform destructive replay/data edits, force push/history rewrite, change breaking APIs, or weaken security controls without explicit approval.
- Retry until successful.

## SHOULD
- Make shutdown ordering observable with structured events/metrics.
- Prefer idempotent work so interrupted jobs can safely retry.
- Keep provider/platform-specific shutdown wiring behind focused adapters.
- Test SIGTERM/container-stop equivalents in integration or staging environments.
