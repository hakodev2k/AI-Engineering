# GPU Topology and Interconnect Rules

## Purpose
Preserve predictable accelerator performance by treating physical and logical topology as a first-class scheduling and design constraint.

## Scope
Applies to PCIe, NVLink-class fabrics, host NUMA layout, rack topology, collective communication paths, and placement policy.

## MUST
- GPU topology MUST be inventoried and exposed to scheduling or placement logic when topology affects workload performance.
- Distributed workload design MUST identify expected intra-host and inter-host communication patterns.
- Topology-sensitive performance claims MUST be validated on the actual hardware layout or a representative equivalent.
- Degraded links or topology changes MUST be detectable and correlated with workload impact.
- Host configuration MUST preserve supported accelerator-to-CPU, accelerator-to-NIC, and accelerator-to-accelerator mappings.

## MUST NOT
- GPU device indices MUST NOT be assumed to imply identical physical locality across hosts.
- Distributed jobs MUST NOT be benchmarked on one topology and generalized to materially different fabrics without evidence.
- Unsupported BIOS, firmware, or PCIe settings MUST NOT be used to chase performance without vendor-supported validation and rollback.

## SHOULD
- Placement SHOULD minimize expensive communication paths for tightly coupled jobs.
- Topology maps SHOULD be refreshed after hardware replacement or firmware changes.

## Exceptions
Exceptions require measured impact, compatibility evidence, rollback, and approval for production-affecting changes.

## Verification
Inspect topology tools, firmware inventory, scheduler labels, collective benchmarks, link-health telemetry, NUMA mappings, and representative workload traces.