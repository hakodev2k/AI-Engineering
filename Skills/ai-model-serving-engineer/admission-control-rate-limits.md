# Admission Control and Rate Limits

## Purpose
Protect inference systems from overload by rejecting, delaying, or degrading work before queues and memory become unstable.

## When to use
Use for multi-tenant serving, bursty workloads, scarce accelerators, or systems where uncontrolled queue growth causes latency collapse or OOM.

## Inputs
Per-replica capacity, queue limits, tenant priorities, request token sizes, concurrency, SLOs, retry behavior, and business criticality.

## Preconditions
Safe operating limits are measured rather than guessed.

## Context to inspect
Gateway rate limits, scheduler queues, max active sequences, token budgets, priority classes, retries, client backoff, and overload responses.

## Core knowledge
Overload protection must consider work size, not request count alone. One long-context generation can consume far more memory and compute than many short requests. Early rejection is often safer than unbounded queueing.

## Procedure
1. Define saturation thresholds from load tests.
2. Choose admission dimensions: requests, tokens, concurrency, queue time, or memory pressure.
3. Define tenant and priority budgets.
4. Bound queue length and wait time.
5. Return explicit overload responses with backoff guidance.
6. Prevent automatic retries from amplifying overload.
7. Test burst, abusive, and large-request scenarios.
8. Monitor rejection rate, fairness, and SLO recovery.
9. Tune thresholds while preserving safety headroom.

## Decision points
Prefer token-aware or resource-aware controls when request sizes vary materially. Reserve capacity for critical traffic only when business policy justifies it.

## Common failure patterns
Rate limiting only by requests/sec, accepting work beyond memory capacity, retry storms, and starving smaller tenants.

## Verification
Overload tests demonstrate bounded queues, no OOM, controlled latency, and predictable rejection behavior.

## Expected output
Admission policies, threshold evidence, retry guidance, and fairness rules.

## Stop conditions
Escalate when capacity cannot support mandatory traffic even after noncritical work is rejected.