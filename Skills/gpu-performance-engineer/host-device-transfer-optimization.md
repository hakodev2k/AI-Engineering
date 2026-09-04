# Host-Device Transfer Optimization

## Purpose
Minimize data-transfer overhead between host and GPU by reducing movement, improving transfer efficiency, and overlapping unavoidable copies with useful work.

## When to use
Use when PCIe/NVLink transfers appear on the critical path, GPU idle time follows data preparation, or request latency is dominated by copy and staging behavior.

## Inputs
- System trace with memcpy activity
- Buffer sizes and transfer frequency
- Host memory allocation strategy
- Interconnect topology
- Data preprocessing and ownership model

## Context to inspect
Inspect pageable versus pinned memory, synchronous versus asynchronous copies, transfer direction, batching, unnecessary round trips, NUMA placement, unified memory behavior, and preprocessing location.

## Core knowledge
Transfer optimization starts by moving less data. Pinned memory and asynchronous copies can improve overlap but increase host-memory pressure. Small transfers often suffer from fixed overhead; batching may matter more than peak link bandwidth.

## Procedure
1. Quantify transfer time and bytes per request or batch.
2. Identify redundant host-device round trips.
3. Move preprocessing or postprocessing to the device when it reduces total movement and is operationally sensible.
4. Batch small transfers where latency constraints permit.
5. Evaluate pinned host memory for sustained asynchronous transfers.
6. Align stream/event dependencies to overlap copies with compute.
7. Check host NUMA affinity for multi-socket systems.
8. Test unified-memory behavior only with measured migration evidence.
9. Re-profile end-to-end latency and transfer overlap.
10. Monitor host memory and CPU costs introduced by the change.

## Decision points
Prefer eliminating transfers over accelerating them. Use pinned memory for high-value recurring transfers, not indiscriminately. Use asynchronous copies only when independent compute exists to overlap. Consider zero-copy or unified memory only when access patterns fit their trade-offs.

## Common failure patterns
- Pinning excessive host memory
- Copying intermediates back to CPU unnecessarily
- Many tiny synchronous transfers
- Assuming asynchronous API calls imply actual overlap
- Ignoring NUMA and topology

## Verification
Verify reduced transferred bytes or copy time, intended overlap in traces, stable latency/throughput, and acceptable host-memory utilization.

## Expected output
A transfer optimization with quantified byte/time reduction, dependency design, and system-level performance evidence.

## Stop conditions
Stop when transfers are no longer material, memory pressure becomes unsafe, or data ownership requirements prohibit the proposed movement.