# Battery and Network Efficiency

## Purpose
Reduce energy and bandwidth cost without compromising correctness or timely UX.

## When to use
High battery usage, frequent polling, background sync, media/data-heavy features.

## Inputs
Energy traces, network traces, freshness requirements, task schedules.

## Context to inspect
Wakeups, polling, GPS/sensors, radio use, retries, payload sizes, background execution.

## Core knowledge
Frequent wakeups and radio activations can cost more than raw CPU. Batch work and align with OS scheduling where latency permits.

## Procedure
1. Measure energy/network behavior on representative flows.
2. Identify unnecessary wakeups and repeated requests.
3. Replace polling with event-driven mechanisms where feasible.
4. Batch/coalesce work.
5. Cache with explicit freshness rules.
6. Compress/resize payloads and media appropriately.
7. Apply network/power constraints to background work.
8. Re-measure battery, bandwidth, and UX latency.

## Decision points
Trade freshness against energy explicitly; do not delay safety- or user-critical operations merely to save power.

## Common failure patterns
Aggressive polling, retry loops, high-accuracy location always on, downloading unchanged data.

## Verification
Energy/network traces and functional tests under constrained connectivity.

## Expected output
Measured efficiency improvement with acceptable freshness/latency.

## Stop conditions
Escalate when product latency requirements conflict with platform energy limits.