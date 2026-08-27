# Layer 4 and Layer 7 Design

## Purpose
Choose and design transport-layer or application-layer load balancing based on protocol semantics, performance, security, and operational needs.

## When to use
Use when introducing or redesigning ingress, internal balancing, proxies, gateways, TCP/UDP services, HTTP APIs, gRPC, or TLS termination.

## Inputs
Protocols, ports, TLS model, routing rules, latency budget, throughput, connection patterns, security controls, observability requirements, and backend capabilities.

## Context to inspect
Inspect client-to-backend flow, NAT, DNS, certificates, proxy headers, HTTP versions, gRPC behavior, source-IP requirements, idle timeouts, and existing network policy.

## Core knowledge
L4 balancing routes connections without HTTP semantics and often minimizes proxy overhead. L7 balancing understands application protocols and enables host/path/header routing, richer policy, retries, and application-aware telemetry, but adds parsing, state, and failure modes.

## Procedure
1. Map each protocol end to end.
2. Identify decisions requiring application metadata.
3. Determine TLS passthrough, termination, or re-encryption requirements.
4. Determine whether source IP must be preserved.
5. Measure latency and throughput budgets.
6. Evaluate connection persistence and multiplexing.
7. Select L4, L7, or a layered design.
8. Define timeout, keepalive, buffer, and connection limits.
9. Define observability and failure behavior.
10. Test protocol correctness and capacity under representative load.

## Decision points
Choose L4 when protocol transparency, source-address behavior, or very high transport throughput dominates. Choose L7 when content routing, authentication integration, HTTP policy, or request-level observability is required. Avoid unnecessary double proxying.

## Common failure patterns
Using L7 for opaque protocols; breaking gRPC with HTTP/1 assumptions; losing client IP; terminating TLS in an unapproved trust zone; inconsistent timeout chains; hidden connection limits.

## Verification
Run protocol-specific integration tests, confirm TLS and source-address behavior, measure latency overhead, and verify routing and failure behavior during backend removal.

## Expected output
A justified balancing layer, protocol flow, termination model, policy set, and validated operational configuration.

## Stop conditions
Escalate when protocol ownership is unclear, cryptographic policy prohibits the proposed termination point, or required network changes cross unapproved trust boundaries.