# Connection Management

## Purpose
Engineer connection lifecycles, pools, keepalives, and limits to prevent socket exhaustion, reset storms, and latency amplification.

## When to use
Use for high concurrency, long-lived connections, connection churn, NAT exhaustion, or unexplained resets.

## Inputs
Connection rates, concurrency, protocol, idle duration, file-descriptor limits, ephemeral-port ranges, NAT topology, and backend pool settings.

## Context to inspect
Inspect client and backend keepalives, TCP state metrics, connection pools, kernel limits, proxy timers, NAT, and deployment drain behavior.

## Core knowledge
Connection capacity depends on sockets, ports, memory, handshake cost, and timers. Keepalive reduces handshake overhead but holds resources. HTTP/2 multiplexing changes connection-count interpretation. Timer mismatch can create resets on reused connections.

## Procedure
1. Measure connection creation, concurrency, reuse, and closure reasons.
2. Map timeout values across every hop.
3. Check socket, descriptor, port, and NAT limits.
4. Tune client-side and backend-side pooling.
5. Align keepalive and idle timers deliberately.
6. Define maximum connection and queue behavior.
7. Test long-lived and burst connection patterns.
8. Exercise rolling deployment drains.
9. Monitor resets, SYN failures, TIME_WAIT, and pool saturation.
10. Record safe operating limits.

## Decision points
Increase reuse when handshake cost dominates; cap persistence when stale or idle connections consume scarce resources. Prefer multiplexed protocols where supported and operationally understood.

## Common failure patterns
Timeout inversion; unbounded connections; port exhaustion; backend pool too small; aggressive idle closure; draining without connection grace.

## Verification
Load test connection churn and steady concurrency, verify no resource exhaustion, and confirm expected graceful closure.

## Expected output
A connection budget, timer matrix, pool settings, and validated capacity limits.

## Stop conditions
Stop when kernel/network ownership prevents required inspection or changing timers would violate another service contract.