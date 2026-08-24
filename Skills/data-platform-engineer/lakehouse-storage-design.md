# Lakehouse Storage Design

## Purpose
Design durable analytical storage layouts and table structures that support scalable reads, writes, governance, evolution, and recovery.

## When to use
Use for object-storage-backed analytical platforms, lakehouse migrations, or storage performance/cost redesigns.

## Inputs
Dataset sizes, query patterns, update frequency, retention, schema evolution, consistency needs, security requirements, and platform constraints.

## Context to inspect
Object layout, table formats, partitions, file sizes, compaction, metadata growth, catalogs, retention jobs, query engines, and storage costs.

## Core knowledge
Object stores favor large immutable objects; table formats add snapshots, transactions, schema evolution, and metadata. Partitioning is a pruning mechanism, not a substitute for indexing. Small files and excessive metadata can dominate performance.

## Procedure
1. Characterize access and mutation patterns.
2. Choose a table format and catalog compatible with required engines and guarantees.
3. Define logical zones only where lifecycle or trust boundaries differ.
4. Select partition keys from observed pruning patterns and cardinality.
5. Establish target file sizes and compaction policy.
6. Define schema and partition evolution rules.
7. Configure retention, snapshots, vacuum/expiration, and legal holds.
8. Design concurrency and commit behavior.
9. Apply encryption, access policies, and sensitive-data controls.
10. Benchmark representative scans, merges, and concurrent writes.
11. Monitor metadata size, file counts, scan bytes, and storage growth.

## Decision points
Partition only when pruning benefit exceeds metadata overhead. Prefer copy-on-write for read-heavy workloads and merge-on-read when write amplification is the larger constraint, subject to engine support. Retain snapshots according to recovery and audit needs, not indefinitely by default.

## Common failure patterns
High-cardinality partitions, tiny files, unbounded snapshots, direct object mutation outside table protocols, incompatible engines, weak catalog governance, and retention that breaks time travel unexpectedly.

## Verification
Measure pruning, file-size distribution, query scan bytes, commit concurrency, schema evolution, rollback/time travel, and recovery from interrupted writes.

## Expected output
Storage standards, table-layout decisions, lifecycle policies, maintenance jobs, benchmarks, and operational metrics.

## Stop conditions
Escalate when required consistency is unsupported, retention conflicts with regulation, or migration could remove the only recoverable copy of data.