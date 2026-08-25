# Block Storage Design

## Purpose
Design block-storage services and volume layouts that provide predictable semantics, performance, resilience, and lifecycle management for databases, virtual machines, and stateful applications.

## When to use
Use when provisioning SAN, cloud volumes, virtual disks, or distributed block devices.

## Inputs
Filesystem/database requirements, volume sizes, IOPS/throughput/latency targets, attachment model, availability requirements, snapshots, encryption, and growth.

## Preconditions
Know whether the consumer expects single-writer, multi-attach, crash consistency, discard/TRIM, or specific sector/alignment behavior.

## Context to inspect
Multipathing, initiators, zoning/security groups, LUN/volume mappings, host queues, filesystem/LVM, replication, and snapshot dependencies.

## Core knowledge
Block storage exposes sectors, not file semantics. Host queueing, multipath behavior, filesystem alignment, write barriers, cache policy, and failure handling can dominate observed behavior.

## Procedure
1. Confirm consumer semantics and SLOs.
2. Choose volume type/tier.
3. Size capacity and performance independently where supported.
4. Define attachment and multipath policy.
5. Align partition/filesystem/database settings.
6. Define encryption and access controls.
7. Plan snapshots, backup, expansion, and replacement.
8. Test failover and path loss.
9. Benchmark representative IO and tail latency.
10. Document host and storage ownership boundaries.

## Decision points
Use dedicated volumes for isolation when noisy-neighbor or lifecycle concerns justify it; consolidate when operational simplicity and utilization matter more. Multi-attach requires an application/filesystem designed for concurrent writers.

## Common failure patterns
Unsafe write caching, filesystem corruption from unsupported multi-attach, queue-depth saturation, misaligned IO, stale multipath configuration, and snapshot chains that degrade performance.

## Verification
Validate path redundancy, fio/application tests, filesystem checks, snapshot/restore, online expansion, and failure behavior.

## Expected output
A validated block-storage design with volume policy, host configuration, performance evidence, protection, and lifecycle procedures.

## Stop conditions
Stop if write semantics are unknown, multi-writer safety is unproven, or a change risks data corruption without tested recovery.
