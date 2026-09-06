# Multi-GPU Topology Rules

## Purpose
Ensure multi-GPU placement and communication decisions reflect the actual hardware topology.

## Scope
PCIe, NVLink-class interconnects, NUMA, device affinity, peer access, and process placement.

## MUST
- Multi-GPU designs MUST inspect and account for deployed accelerator and host topology.
- Rank, process, and device placement MUST be deterministic and documented.
- Cross-device traffic MUST be measured for critical workloads.
- NUMA and host-memory affinity MUST be validated when host staging is material.

## MUST NOT
- MUST NOT assume all GPU pairs have equivalent bandwidth or latency.
- MUST NOT benchmark on one topology and generalize results to materially different deployments without evidence.
- MUST NOT enable peer access blindly without validating support and isolation requirements.

## SHOULD
- SHOULD place communication-heavy peers on the fastest available links.
- SHOULD expose topology metadata in benchmark and incident records.

## Exceptions
Exceptions require documented deployment constraints and measured impact.

## Verification
Inspect topology maps, affinity settings, peer-access tests, communication traces, and multi-GPU benchmarks.