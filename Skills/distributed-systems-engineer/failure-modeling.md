# Failure Modeling

## Purpose
Identify how a distributed system can fail and design explicit behavior for partial, delayed, duplicated, reordered, or unavailable operations.

## When to use
Use when designing or changing multi-service workflows, remote calls, messaging, replicated state, or critical background processing.

## Inputs
Architecture, dependency map, SLAs/SLOs, data flows, protocols, traffic profile, and business invariants.

## Preconditions
Understand which components communicate across process or network boundaries and which operations are business-critical.

## Context to inspect
Inspect dependency ownership, timeout settings, retry policies, queues, persistence boundaries, deployment topology, and historical incidents.

## Core knowledge
Distributed failures are often partial rather than binary. A request can time out after the remote side committed; messages can be duplicated; clocks and observations can disagree. Design around uncertainty instead of assuming reliable synchronous execution.

## Procedure
1. Map every remote dependency and asynchronous boundary.
2. Enumerate failure modes: unavailable, slow, timeout, duplicate, reorder, corruption, partition, overload, and dependency degradation.
3. Define the business impact of each mode.
4. Classify operations by safety to retry and reversibility.
5. Define timeout, retry, fallback, isolation, and recovery behavior.
6. Specify observability needed to distinguish failure modes.
7. Test representative failures with controlled fault injection.
8. Record residual risks and operational recovery steps.

## Decision points
Fail fast when stale or partial results are dangerous. Degrade gracefully when reduced functionality is preferable to total outage. Retry only transient failures and only when the operation is safe or idempotent.

## Common failure patterns
Infinite retries, synchronized retry storms, treating timeout as proof of failure, hidden fallback behavior, and assuming internal networks are reliable.

## Verification
Demonstrate expected behavior for dependency outage, latency, timeout-after-commit, duplicate delivery, and recovery. Confirm metrics and alerts expose each important state.

## Expected output
A documented failure model with explicit handling, tests, telemetry, and recovery behavior.

## Stop conditions
Escalate when business invariants are unknown, failure handling could cause irreversible loss, or required dependency guarantees cannot be established.