# TCP and Socket Capacity Engineering

## Purpose
Diagnose and size Linux socket/TCP resources for high-connection services without masking application overload.

## When to use
Use for connection resets, accept failures, SYN backlog pressure, ephemeral-port exhaustion, TIME_WAIT concerns, or socket-buffer bottlenecks.

## Inputs
Connection rate/concurrency, protocol roles, latency, socket metrics, kernel counters, application backlog settings, and network topology.

## Context to inspect
Inspect listen queues, established/TIME_WAIT states, ephemeral port range, file descriptors, conntrack/NAT, retransmits, socket buffers, cgroups, and load balancers.

## Core knowledge
Connection capacity spans application accept rate, listen queues, file descriptors, ports, memory, conntrack, NAT, and remote behavior. TIME_WAIT is usually correctness, not inherently a defect.

## Procedure
1. Define failing connection phase and expected rate/concurrency.
2. Measure socket states, listen queues, drops, retransmits, and errors.
3. Check process/system file-descriptor limits.
4. Check ephemeral ports and NAT/conntrack when the host initiates connections.
5. Correlate queue pressure with application accept/service rate.
6. Verify application and kernel backlog interaction.
7. Tune only the proven limiting resource.
8. Load-test beyond expected peak and observe secondary memory/CPU cost.

## Decision points
Increase queues for short bursts when downstream can drain them; scale/optimize when sustained arrival exceeds service rate. Expand ports only when actual allocation pressure exists.

## Common failure patterns
Aggressive TIME_WAIT reuse folklore, huge backlogs hiding overload, raising fd limits without memory planning, ignoring NAT exhaustion, and tuning TCP before measuring application accept rate.

## Verification
Peak tests show acceptable connection success, queue depth, retransmits, port/fd headroom, memory, and latency.

## Expected output
Identified socket-capacity constraint, justified sizing, and load-test evidence.

## Stop conditions
Stop when network appliances/NAT ownership is external or production load tests could breach service safety limits.