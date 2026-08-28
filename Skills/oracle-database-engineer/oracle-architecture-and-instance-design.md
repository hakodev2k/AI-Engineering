# Oracle Architecture and Instance Design

## Purpose
Design and review Oracle Database instances so memory, processes, storage, services, and availability choices match workload and operational requirements.

## When to use
Use for new databases, major workload changes, consolidation, or architecture reviews. Do not copy production parameters from another system without workload evidence.

## Inputs
Workload profile, data size and growth, availability objectives, platform topology, licensing constraints, security requirements, performance evidence.

## Preconditions
Business RTO/RPO, critical workloads, supported Oracle version, and infrastructure limits are known.

## Context to inspect
SGA/PGA configuration, background processes, services, redo/undo, control files, tablespaces, parameter files, listener topology, storage and cluster architecture.

## Core knowledge
Oracle performance and resilience are emergent properties of instance configuration, workload shape, storage latency, concurrency, and recovery design. Parameter changes should be evidence-driven and reversible.

## Procedure
1. Classify OLTP, analytical, batch, mixed, and maintenance workloads.
2. Capture peak concurrency, I/O, CPU, memory, and growth requirements.
3. Select single-instance, RAC, or replicated architecture based on failure domains and workload needs.
4. Define services and workload isolation boundaries.
5. Size SGA/PGA from evidence and platform limits.
6. Design redo, undo, temp, control-file, and FRA capacity.
7. Validate storage latency and throughput requirements.
8. Establish parameter-management, startup, and recovery conventions.
9. Document dependencies, licenses, and operational ownership.
10. Test representative load and failure scenarios before production.

## Decision points
Prefer simpler single-instance architecture unless RAC or another HA topology solves a demonstrated requirement. Favor automatic memory features only when predictability and platform constraints permit.

## Common failure patterns
Oversized memory, undersized redo or FRA, service ambiguity, parameter cargo culting, and HA architecture without tested recovery procedures.

## Verification
Validate startup/restart, representative workload metrics, storage latency, memory pressure, service routing, and recovery prerequisites.

## Expected output
An evidence-backed Oracle instance architecture, configuration baseline, capacity assumptions, and validation record.

## Stop conditions
Stop when RTO/RPO, licensing, infrastructure limits, or workload evidence are missing or contradictory.