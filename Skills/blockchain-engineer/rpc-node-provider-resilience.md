# RPC and Node Provider Resilience

## Purpose
Build reliable blockchain access that tolerates provider outages, rate limits, inconsistent node views, latency spikes, and partial chain synchronization.

## When to use
Use for backend services, wallets, relayers, indexers, automation, and production systems that depend on RPC endpoints.

## Inputs
Target chains, RPC methods, traffic patterns, latency/SLA needs, provider options, archive/debug requirements.

## Preconditions
Critical RPC-dependent workflows and acceptable degradation are identified.

## Context to inspect
Endpoint topology, provider quotas, retries, timeouts, batching, websocket subscriptions, archive support, load balancing, caching, and health checks.

## Core knowledge
RPC providers can disagree temporarily because of reorgs, lag, pruning, implementation differences, or network partitions. Blind retries can amplify load or submit duplicate transactions.

## Procedure
1. Classify RPC calls as read, subscription, simulation, or state-changing submission.
2. Define explicit timeouts and bounded retry rules per class.
3. Configure multiple independent endpoints for critical chains.
4. Health-check block height, chain ID, latency, and error rate.
5. Route archive/debug methods only to capable nodes.
6. Deduplicate transaction submission and treat unknown results carefully.
7. Reconcile important reads against block numbers/hashes.
8. Handle websocket disconnects with catch-up scans.
9. Add provider-level metrics and circuit breakers.
10. Test outage, throttling, lag, and inconsistent-view scenarios.

## Decision points
Use managed providers for operational simplicity; run nodes when sovereignty, special APIs, latency, archive data, or independent verification justify the cost.

## Common failure patterns
Single-provider dependency, infinite retries, no block context on reads, missed events after websocket reconnect, and assuming a submit timeout means the transaction failed.

## Verification
Chaos tests exercise provider loss and lag; production metrics show successful failover without duplicate side effects.

## Expected output
RPC topology, retry/failover policy, health checks, and evidence of resilient behavior.

## Stop conditions
Escalate when critical workflows have no independent provider or node path and outage risk exceeds tolerance.