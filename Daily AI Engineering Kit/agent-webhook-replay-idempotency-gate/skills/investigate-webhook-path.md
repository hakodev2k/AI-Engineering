# Investigate Webhook Path

## Purpose
Map a webhook from ingress to irreversible side effects and collect evidence needed to place an idempotency boundary.

## Use when
Duplicate deliveries, provider retries, timeouts, worker redelivery, or replay tooling can execute the same event more than once.

## Inputs
Endpoint/consumer name, provider event identifier rules, signature mechanism, handler code, persistence path, side effects, existing tests and logs.

## Preconditions
Read access to relevant repository files and non-secret configuration. Production mutation access is unnecessary.

## Procedure
1. Locate HTTP/queue ingress and signature validation.
2. Identify the strongest stable provider event ID; record whether it is globally unique or scoped.
3. Trace parsing, validation, transaction boundaries, queue publication and external side effects.
4. Find every retry source: provider, reverse proxy, queue, scheduler and application retry policy.
5. Locate existing deduplication, unique constraints and transaction/outbox logic.
6. Record facts with file/line or test/log evidence; keep hypotheses separate.
7. Choose the claim point after authenticity validation but before the first side effect.
8. Determine whether key reuse with different payload bytes must be rejected.
9. Identify crash windows between claim, business commit and completion marking.
10. Hand off an evidence map and explicit open questions.

## Output
Ingress, event-key source, signature boundary, side effects, transaction boundary, retry sources, crash windows, tests, facts, hypotheses and risks.

## Verification
Every claimed side effect and retry source has repository/config/test evidence.

## Failure handling
If no stable event ID exists, stop implementation and require a documented composite-key strategy. If signature verification is absent, flag it as blocking rather than moving the claim before authentication.

## Stop conditions
Stop before production configuration, schema mutation, destructive cleanup, or weakened authentication without explicit approval.
