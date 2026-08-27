# Kernel Networking with eBPF

## Purpose
Design safe eBPF networking logic for packet visibility, filtering, routing, load balancing, or policy.

## When to use
Use with XDP, TC, cgroup networking, socket hooks, or related datapath programs.

## Inputs
Traffic model, topology, policy, throughput/latency SLOs, MTU, protocol requirements, kernel/NIC capabilities.

## Context to inspect
Inspect hook location, packet representation, offload/GRO/GSO behavior, namespaces, routing, checksums, fragmentation, and existing datapath ownership.

## Core knowledge
Hook placement determines packet form and semantics. XDP is early and fast but constrained; TC sees skb context and integrates later. Correct parsing must be bounds-checked and protocol-aware.

## Procedure
1. Define desired action and packet lifecycle point.
2. Select hook based on semantics before performance.
3. Parse headers with explicit bounds checks.
4. Handle VLANs, IPv4/IPv6, extension headers, fragmentation as required.
5. Define state and concurrency for flows/policy.
6. Preserve checksum/MTU semantics when modifying packets.
7. Add counters for actions, errors, and fallbacks.
8. Test namespaces, routing variants, and peak PPS.
9. Validate fail-open/fail-closed behavior deliberately.

## Decision points
Use XDP for earliest high-rate processing; TC for skb-level semantics; cgroup/socket hooks for workload-oriented policy. Offload only when hardware capability and semantic parity are proven.

## Common failure patterns
Unsafe parsing, assuming linear packets, IPv4-only logic, broken checksums, incorrect endianness, hidden MTU changes, and policy state leaks.

## Verification
Packet captures, counters, conformance traffic, failure injection, throughput/latency benchmarks, and rollback tests must agree.

## Expected output
A bounded datapath with explicit hook semantics, protocol coverage, and measured impact.

## Stop conditions
Stop when correctness cannot be established for required protocols or failure behavior is unacceptable.