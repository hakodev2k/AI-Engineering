# Recursive Resolver Engineering

## Purpose
Operate recursive DNS resolvers for reliable, secure, low-latency name resolution.

## When to use
Resolver deployment, cache incidents, SERVFAIL spikes, latency, forwarding redesign, or DNS egress control.

## Inputs
Resolver configuration, query logs/metrics, client populations, upstream policy, cache statistics, network paths.

## Context to inspect
Recursion ACLs, forwarding, root hints, cache sizing, negative caching, DNSSEC validation, QNAME minimization, rate limits, and HA.

## Core knowledge
Recursive resolution is stateful caching across delegations. Separate client-to-resolver failure from resolver-to-authority failure. Open recursion is a security risk.

## Procedure
1. Define client scope and resolution policy.
2. Baseline QPS, latency, cache hit rate, SERVFAIL/NXDOMAIN.
3. Validate recursion ACLs and egress reachability.
4. Trace failing names iteratively.
5. Inspect cache and negative-cache behavior.
6. Validate DNSSEC/time dependencies.
7. Tune capacity and concurrency from measured load.
8. Design redundant resolver addresses and failure behavior.
9. Test cold-cache and upstream-authority failure.
10. Monitor tail latency and error codes.

## Decision points
Forward to upstream resolvers when policy/centralization matters; full recursion gives independence and visibility. Use local caching near clients when WAN latency or isolation justifies it.

## Common failure patterns
Open recursion, forwarding loops, undersized caches, stale policy zones, broken IPv6 egress, DNSSEC failures blamed on applications, and shared resolver single points.

## Verification
Resolve signed/unsigned, positive/negative, cached/uncached names; confirm ACL denial, latency, HA, and error rates.

## Expected output
Validated resolver configuration, capacity/security posture, test evidence, and monitoring thresholds.

## Stop conditions
Escalate when upstream policy is unknown, DNSSEC failures indicate external chain problems, or changes could disrupt organization-wide resolution without rollback.