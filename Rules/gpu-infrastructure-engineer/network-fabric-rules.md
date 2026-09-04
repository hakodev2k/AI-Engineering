# GPU Network Fabric Rules

## Purpose
Protect distributed accelerator workloads from network bottlenecks, congestion, and silent fabric degradation.

## Scope
Applies to high-throughput cluster networks, NICs, RDMA-capable paths, routing, congestion control, and workload communication.

## MUST
- Network design MUST be sized from measured distributed workload traffic patterns and target scale.
- Required NIC, driver, firmware, transport, MTU, and congestion settings MUST be versioned and validated as a compatible set.
- Packet loss, retransmission, link errors, congestion, and throughput MUST be observable per relevant failure domain.
- Fabric changes MUST be tested with representative collective and point-to-point workloads before broad rollout.
- Network isolation controls MUST preserve tenant and management-plane boundaries.

## MUST NOT
- A successful ping MUST NOT be treated as proof that a GPU fabric is healthy.
- Security controls MUST NOT be disabled merely to improve benchmark throughput.
- Production-wide fabric tuning MUST NOT be performed without rollback and blast-radius controls.

## SHOULD
- Synthetic tests SHOULD be correlated with application-level communication metrics.
- Capacity planning SHOULD include oversubscription and failure scenarios.

## Exceptions
Exceptions require evidence, risk, bounded scope, rollback, and approval.

## Verification
Review fabric telemetry, configuration diffs, link health, collective benchmarks, failure tests, and workload traces.