# Lease-Safe Processing

## Purpose
Implement or review a queue consumer so that long-running work renews ownership safely and stops immediately when ownership is lost.

## Inputs
Message identifier, ownership token, visibility timeout, renewal API, handler, idempotency key, settlement API, policy file.

## Preconditions
The provider supports ownership renewal or the handler always completes comfortably before visibility expiry. Idempotency storage is available for side-effecting work.

## Procedure
1. Acquire the message and capture the provider-issued ownership token.
2. Reject side-effecting processing if the required idempotency key is missing.
3. Start a monotonic lease timer; never derive expiry from wall-clock time alone.
4. Schedule heartbeats before `visibility_timeout - renew_before`.
5. Before each renewal, assert that the local ownership token is still current.
6. Renew for a bounded duration and replace the ownership token if the provider returns a new one.
7. If renewal fails transiently, retry only within the remaining safe lease window and policy retry limit.
8. If renewal is rejected, token ownership changes, maximum lease duration is reached, or the safe window closes, cancel the handler and do not settle the message.
9. Commit external side effects under the idempotency key.
10. Re-check ownership before final settlement.
11. Complete/delete only after the handler and durable side effects succeed.
12. On handler failure, abandon/release according to policy; do not acknowledge success.
13. Record lease duration, renewal count, ownership transitions, outcome, and delivery count.

## Verification
- A slow handler renews before expiry.
- A stale token causes processing to stop.
- Renewal failure cannot result in late settlement.
- Duplicate delivery does not duplicate protected side effects.
- Renewal count and total lease duration remain bounded.

## Failure handling
Transient provider failures: bounded retry while enough lease time remains. Permission/configuration failures: stop. Handler failures: preserve evidence and abandon. Lease lost: cancel work and block settlement.

## Stop conditions
Never continue after lease loss. Never raise concurrency or visibility settings to hide an ownership bug without evidence and approval for production configuration changes.
