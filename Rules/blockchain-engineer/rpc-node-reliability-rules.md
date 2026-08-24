# RPC and Node Reliability

## Purpose
Prevent unreliable node infrastructure from causing incorrect application conclusions or unsafe transaction behavior.

## Scope
RPC providers, self-hosted nodes, archival access, subscriptions, load balancing, and chain reads/writes.

## MUST
- Define required node capabilities, sync state, network identity, and freshness checks.
- Treat RPC timeouts, inconsistent responses, lag, and provider outages as expected failure modes.
- Verify critical reads against block context and required finality.
- Use bounded retries with backoff for safe operations.
- Detect provider disagreement when a single incorrect response could cause material loss.

## MUST NOT
- Retry transaction submission indefinitely.
- Assume HTTP success means a node is synced or on the intended chain.
- Depend on provider-specific behavior without documenting it.

## SHOULD
- Use provider diversity or self-hosted validation for high-value operations.
- Monitor head lag, error rates, latency, and chain identity.

## Exceptions
Single-provider designs require documented outage/incorrect-data exposure and recovery procedures.

## Verification
Inject RPC faults, compare providers, inspect retry logic, validate chain/sync checks, and review node health telemetry.