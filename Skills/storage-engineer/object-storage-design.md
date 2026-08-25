# Object Storage Design

## Purpose
Design object-storage usage around bucket/container boundaries, key design, consistency, lifecycle, durability, throughput, and cost.

## When to use
Use for large unstructured datasets, backups, media, artifacts, data lakes, or cloud-native durable blobs.

## Inputs
Object count/size distribution, request rates, key patterns, retention, consistency needs, durability, region requirements, egress, and cost constraints.

## Preconditions
Confirm applications can use object semantics rather than POSIX filesystem assumptions.

## Context to inspect
Buckets, prefixes, lifecycle rules, replication, versioning, encryption, IAM, network endpoints, inventory, and API retry behavior.

## Core knowledge
Object stores optimize durable key-addressed objects. Request distribution, multipart operations, listing behavior, versioning, egress, and lifecycle policies materially affect performance and cost.

## Procedure
1. Define object and metadata model.
2. Choose bucket/container boundaries and naming.
3. Define consistency-sensitive workflows.
4. Estimate request, capacity, retrieval, and egress costs.
5. Configure encryption and least-privilege access.
6. Define versioning, retention, lifecycle, and replication.
7. Design multipart upload and retry/idempotency behavior.
8. Plan inventory and integrity verification.
9. Load-test representative object sizes and concurrency.
10. Test recovery from deleted/corrupt logical data.

## Decision points
Use versioning where recovery value exceeds storage growth. Cross-region replication improves resilience but increases cost and may replicate unwanted logical changes; immutable backup may still be required.

## Common failure patterns
Treating object storage as a filesystem, unbounded versions, expensive LIST patterns, accidental public access, retry storms, and unexpected egress charges.

## Verification
Validate access boundaries, lifecycle transitions, replication, checksums, restore paths, and request/cost estimates under representative load.

## Expected output
A secure, costed object-storage design with key model, lifecycle, protection, performance evidence, and recovery procedures.

## Stop conditions
Stop when data residency, retention, or deletion semantics are unresolved or application correctness depends on unsupported filesystem behavior.
