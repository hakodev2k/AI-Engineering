# Occupancy and Register Rules

## Purpose
Balance occupancy, register pressure, shared memory, and instruction efficiency using measured evidence.

## Scope
Kernel launch configuration, register allocation, occupancy, spills, and resource constraints.

## MUST
- Occupancy tuning MUST consider register usage, shared memory, block size, and active warps together.
- Register spills MUST be measured when suspected to affect performance.
- Launch configurations MUST be validated for supported architectures and input shapes.
- Any occupancy target MUST be justified by workload behavior rather than a universal threshold.

## MUST NOT
- MUST NOT maximize occupancy as an objective independent of latency or throughput.
- MUST NOT reduce registers if resulting spills or extra instructions erase the benefit.
- MUST NOT hard-code launch parameters that exceed supported device limits.

## SHOULD
- SHOULD compare multiple launch configurations on representative workloads.
- SHOULD document architecture-specific resource constraints.

## Exceptions
Exceptions require profiler evidence and documented trade-offs.

## Verification
Review occupancy reports, register counts, spill metrics, launch validation, and benchmarks.