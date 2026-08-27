# Cloud Network Performance Engineering

## Purpose
Diagnose and improve cloud network latency, throughput, packet loss, connection scale, and jitter using measured evidence.

## When to use
Use for degraded application performance, throughput ceilings, intermittent loss, high connection latency, or capacity planning.

## Inputs
Symptoms, baseline/SLO, topology, traffic profile, metrics, flow logs, packet captures, host/container metrics, and provider limits.

## Preconditions
Establish a reproducible measurement and avoid changing multiple variables before collecting baseline evidence.

## Context to inspect
NIC limits, instance bandwidth, PPS limits, load balancers, NAT, firewalls, MTU, TCP behavior, cross-zone/region paths, DNS latency, and application connection pools.

## Core knowledge
Network performance is constrained by the narrowest resource: bandwidth, PPS, connection tracking, NAT ports, appliance capacity, CPU, MTU, congestion, or protocol behavior. Average latency hides tail degradation.

## Procedure
1. Define the exact performance symptom and percentile.
2. Reproduce with representative traffic.
3. Map packet path and component limits.
4. Measure latency, loss, throughput, PPS, connections, retransmits, and saturation.
5. Separate application, host, and network effects.
6. Check MTU and fragmentation/PMTUD.
7. Inspect stateful appliance/NAT capacity.
8. Test alternative paths or sizes one variable at a time.
9. Implement the smallest justified change.
10. Re-run identical measurements and compare.

## Decision points
Scale up when a single component limit dominates and larger capacity is economical; scale out when horizontal distribution improves failure domains and throughput. Optimize cross-zone paths only after quantifying cost and resilience trade-offs.

## Common failure patterns
Benchmarking from an underpowered client, trusting averages, ignoring PPS/connection limits, premature tuning of TCP, testing with unrealistic payloads, and declaring success without before/after evidence.

## Verification
Compare controlled before/after results, validate SLO percentiles under expected peak load, and confirm no reliability/security regression.

## Expected output
A bottleneck hypothesis, measurements, validated root cause, remediation, and regression benchmark.

## Stop conditions
Stop when testing could overload production, provider-side evidence requires support escalation, or measurements contradict the working hypothesis.