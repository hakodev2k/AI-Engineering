# Block, File, and Object Storage Selection

## Purpose
Select the correct storage abstraction from workload semantics rather than convenience or vendor defaults.

## When to use
Use when designing persistence for databases, VMs, containers, shared applications, analytics, archives, media, or data lakes.

## Inputs
Access semantics, consistency needs, object/file sizes, metadata behavior, concurrency, protocol requirements, performance targets, retention, portability, and cost constraints.

## Context to inspect
Application APIs, filesystem assumptions, database requirements, mount behavior, network topology, existing services, and migration constraints.

## Core knowledge
Block storage exposes addressable volumes and fits filesystems/databases; file storage provides hierarchical shared namespaces; object storage provides key-based immutable-or-replaced objects with scalable metadata and lifecycle capabilities. Semantics differ in locking, rename, append, consistency, and latency.

## Procedure
1. Identify required application semantics before naming technologies.
2. Determine whether POSIX-like filesystem behavior is mandatory.
3. Measure object sizes, operation mix, metadata intensity, and concurrency.
4. Identify shared-writer and locking requirements.
5. Evaluate consistency and atomicity expectations.
6. Compare performance, scalability, lifecycle, replication, and cost.
7. Check client/library/protocol compatibility.
8. Prototype ambiguous workloads.
9. Document constraints and migration implications.
10. Select the least complex abstraction that satisfies requirements.

## Decision points
Use block for low-level volume semantics and latency-sensitive databases; file for shared hierarchical access; object for massive scale, immutable data, distribution, and lifecycle management. Avoid emulating filesystem semantics over object storage unless the compatibility layer is proven for the workload.

## Common failure patterns
Using object storage for rename-heavy applications, shared file systems without lock analysis, block volumes as ad-hoc sharing mechanisms, and ignoring request or egress pricing.

## Verification
Run representative operations including concurrency, failures, large listings, metadata-heavy paths, and recovery. Confirm application semantics, not merely successful connectivity.

## Expected output
A storage-type decision with evidence, constraints, performance expectations, and fallback options.

## Stop conditions
Stop when application semantics are undocumented, protocol support is uncertain, or a destructive migration would be required without an approved recovery plan.