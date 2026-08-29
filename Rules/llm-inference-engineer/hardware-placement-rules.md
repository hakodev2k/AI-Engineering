# Hardware Placement Rules

## Purpose
Ensure model placement across accelerators and hosts is deliberate, compatible, efficient, and failure-aware.

## Scope
Applies to tensor parallelism, pipeline parallelism, expert parallelism, NUMA locality, multi-GPU topology, accelerator selection, and host placement.

## MUST
- Placement decisions MUST account for model memory, KV cache demand, interconnect topology, communication overhead, and failure domains.
- Multi-device deployments MUST validate that the selected parallelism strategy meets correctness and latency objectives on the target hardware.
- Hardware-specific deployment profiles MUST be versioned and reproducible.
- Placement changes MUST be benchmarked on the actual or materially equivalent topology before production rollout.
- Cross-host model execution MUST define behavior for partial device or network failure.

## MUST NOT
- MUST NOT assume identical accelerator models have identical effective performance across different interconnect or host configurations.
- MUST NOT place latency-critical shards across slow links without measurement.
- MUST NOT overcommit accelerator memory when OOM recovery would threaten unrelated workloads.

## SHOULD
- Placement SHOULD minimize avoidable cross-device communication on latency-sensitive paths.
- Heterogeneous hardware SHOULD use explicit routing or compatibility profiles rather than implicit scheduling.

## Exceptions
Exceptions require topology evidence, measured impact, failure analysis, rollback steps, and production approval when availability or capacity is affected.

## Verification
Inspect placement manifests, topology data, benchmark results, device-memory telemetry, parallelism configuration, and failure tests.