# GPU Capacity Planning Rules

## Purpose
Ensure accelerator capacity decisions are based on demand, service objectives, hardware constraints, and failure headroom.

## Scope
Applies to procurement, cloud reservations, fleet expansion, capacity allocation, and retirement planning.

## MUST
- Capacity plans MUST use measured demand, queue delay, utilization, workload growth, hardware availability, and required failure headroom.
- Plans MUST distinguish allocatable GPU capacity from installed capacity and account for maintenance, unhealthy devices, fragmentation, and reserved headroom.
- Forecasts MUST model accelerator type and memory requirements rather than aggregate GPU count alone.
- Capacity shortages that threaten committed objectives MUST be escalated before sustained saturation occurs.
- Expansion decisions MUST include network, CPU, memory, storage, power, and cooling implications.

## MUST NOT
- Peak utilization alone MUST NOT be used as proof that more GPUs are required.
- Average fleet utilization MUST NOT hide shortages in specific accelerator pools.
- Capacity plans MUST NOT assume newly acquired hardware is immediately schedulable or workload-compatible.

## SHOULD
- Forecasts SHOULD include multiple demand scenarios and lead-time risk.
- Idle capacity SHOULD be evaluated against resilience, queue latency, and interruption cost before being classified as waste.

## Exceptions
Exceptions require documented assumptions, uncertainty, operational risk, and accountable approval.

## Verification
Review demand history, queue metrics, fleet health, reservations, forecasts, hardware lead times, and post-capacity-change utilization evidence.