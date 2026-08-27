# Kernel Network Stack Rules

## Purpose
Preserve protocol correctness, isolation, throughput, and safe handling of untrusted network data.

## Scope
Packet parsing, sockets, protocol state, queues, routing, filtering, offloads, and network namespaces.

## MUST
- Packet-derived lengths, offsets, headers, and state transitions MUST be validated before memory access.
- Protocol state machines MUST handle duplicate, reordered, truncated, and unexpected input safely.
- Queue growth and buffering controlled by external traffic MUST be bounded.
- Namespace and credential boundaries MUST be preserved for network resources.
- Fast-path changes MUST be supported by correctness and performance evidence.

## MUST NOT
- MUST NOT trust checksum/offload metadata outside its documented validity conditions.
- MUST NOT retain packet or socket references beyond their valid lifetime.
- MUST NOT create retry or retransmission behavior that can grow without bounds.
- MUST NOT bypass policy/filtering hooks accidentally when adding alternate data paths.

## SHOULD
- Parsing SHOULD minimize repeated work while retaining explicit validation.
- Backpressure SHOULD be preferred over unbounded buffering.
- Protocol changes SHOULD include interoperability testing.

## Exceptions
Exceptions require protocol rationale, resource-bound analysis, compatibility evidence, and maintainer approval.

## Verification
Use protocol tests, malformed-packet tests, namespace/isolation tests, stress and saturation workloads, tracing, memory diagnostics, and interoperability suites.