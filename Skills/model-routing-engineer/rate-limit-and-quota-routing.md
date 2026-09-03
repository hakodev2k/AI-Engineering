# Rate-Limit and Quota Routing

## Purpose
Keep inference traffic within provider, account, tenant, and regional quota limits while preserving service quality.

## When to use
Use when providers impose requests-per-minute, tokens-per-minute, concurrency, daily spend, or model-specific capacity limits.

## Inputs
Provider quotas, current usage, traffic forecasts, model alternatives, tenant priorities, SLOs.

## Context to inspect
Rate-limit headers, local counters, queue depth, burst patterns, retry behavior, reserved capacity, and provider-specific reset semantics.

## Core knowledge
Quota is dynamic state, not static configuration. Routing must distinguish local throttling from provider throttling and account for delayed usage signals. Blind retries can convert a small limit breach into an outage.

## Procedure
1. Enumerate every enforced quota dimension.
2. Track usage with safety margin for delayed or approximate provider data.
3. Predict request token demand where possible.
4. Reserve capacity for critical traffic classes.
5. Filter routes that cannot accept the request within deadline.
6. Apply bounded queueing or load shedding.
7. Route to eligible alternate capacity when available.
8. Respect provider retry-after/reset signals.
9. Monitor saturation and forecast exhaustion.
10. Test burst and sustained-overload scenarios.

## Decision points
Queue when deadlines permit; shed low-priority work when waiting would violate SLOs; switch providers only when policy and quality constraints remain satisfied.

## Common failure patterns
Ignoring token quotas, sharing one counter across unrelated limits, retry storms, no reserved capacity, and routing based on stale quota state.

## Verification
Verify controlled load tests, correct enforcement of tenant priorities, no unbounded retries, and predictable behavior near quota exhaustion.

## Expected output
A quota-aware routing policy with counters, reservations, shedding rules, and fallback behavior.

## Stop conditions
Stop when provider quota semantics are unknown or required real-time usage signals are inaccessible.