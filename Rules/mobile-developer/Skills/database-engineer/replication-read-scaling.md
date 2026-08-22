# Replication and Read Scaling

## Purpose
Use replicas safely for availability, reporting, or read throughput while accounting for lag and consistency semantics.

## When to use
Use when adding replicas, routing reads, offloading analytics, or diagnosing stale-read and replication issues.

## Inputs
Read/write workload, consistency needs, replication technology, lag metrics, topology, connection routing, and failure behavior.

## Context to inspect
Inspect which reads require read-your-writes or strong freshness, replica capacity, lag distribution, long-running queries, and promotion eligibility.

## Core knowledge
Read replicas add capacity only for workloads tolerant of their consistency and routing properties. Replication introduces lag, operational complexity, and additional failure modes.

## Procedure
1. Classify reads by freshness and consistency requirement.
2. Measure primary workload and expected offload.
3. Choose replication mode and replica placement.
4. Define routing rules for safe read categories.
5. Ensure writes and consistency-sensitive reads stay on an appropriate authority.
6. Monitor lag in time and bytes/positions.
7. Prevent heavy replica queries from causing replay delays.
8. Define behavior when replicas are unavailable or stale.
9. Test promotion implications if replicas also serve HA.
10. Benchmark actual primary relief and replica saturation.

## Decision points
Route eventually consistent workloads to replicas; keep transactional decision reads on the primary unless the engine provides required guarantees.

## Common failure patterns
Sending all GET requests to replicas, ignoring read-after-write requirements, overloading replicas with reports, and treating lag as a single average metric.

## Verification
Test freshness-sensitive workflows, failover routing, lag under peak writes, and capacity benefit.

## Expected output
A documented replication and read-routing policy with consistency boundaries and monitoring thresholds.

## Stop conditions
Stop when business flows cannot tolerate replica semantics or replication capacity is insufficient for expected workload.