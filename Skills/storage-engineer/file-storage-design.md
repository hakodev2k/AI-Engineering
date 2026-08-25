# File Storage Design

## Purpose
Design shared file services with correct namespace, locking, permissions, performance, and failure behavior.

## When to use
Use for NFS/SMB or distributed filesystems serving shared application, user, analytics, or content workloads.

## Inputs
Client types, namespace, file counts/sizes, metadata rate, locking semantics, permissions, throughput/latency, availability, and retention.

## Preconditions
Identify protocol versions and application expectations for locking, consistency, identity, and rename semantics.

## Context to inspect
Exports/shares, mount options, identity services, network paths, metadata servers, quotas, snapshots, antivirus/indexing, and client caches.

## Core knowledge
File workloads often bottleneck on metadata, directory structure, locking, or small-file operations rather than bandwidth. Protocol and client-cache semantics affect correctness.

## Procedure
1. Characterize data and metadata operations.
2. Select protocol/version and namespace boundaries.
3. Define identity, permissions, and export controls.
4. Size data and metadata paths.
5. Configure client mount/cache behavior deliberately.
6. Define quotas and lifecycle policies.
7. Design HA and failure recovery.
8. Test locking, rename, reconnect, and concurrent access.
9. Benchmark realistic directory and file distributions.
10. Validate backup and restore.

## Decision points
Choose scale-up NAS for simpler bounded workloads; distributed file systems when namespace/capacity/throughput require horizontal scale and operational complexity is acceptable.

## Common failure patterns
Huge hot directories, UID/GID mismatches, stale locks, unsafe cache assumptions, metadata saturation, and backups that cannot restore permissions or ACLs.

## Verification
Run protocol-specific correctness tests, failover tests, permission checks, metadata benchmarks, and representative restore tests.

## Expected output
A file-service design with protocol policy, namespace, access model, sizing, HA, and validated operational procedures.

## Stop conditions
Escalate when application locking/consistency requirements are unknown or identity mappings cannot be made deterministic.
