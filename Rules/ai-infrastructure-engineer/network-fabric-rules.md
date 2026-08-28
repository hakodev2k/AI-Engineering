# Network Fabric Rules

## Purpose
Protect communication performance and reliability for distributed AI workloads.

## Scope
Applies to east-west traffic, accelerator interconnects, RDMA, collective communication, routing, and congestion control.

## MUST
- Network design MUST be validated against representative distributed workload patterns.
- Latency, packet loss, retransmission, congestion, and link utilization MUST be observable.
- Failure domains and oversubscription ratios MUST be documented for critical clusters.
- Changes affecting collective communication MUST include before/after performance evidence.

## MUST NOT
- MUST NOT diagnose distributed training slowdown from application metrics alone when network evidence is available.
- MUST NOT introduce asymmetric routing or policy changes without validating accelerator communication paths.
- MUST NOT claim network headroom without measured peak utilization.

## SHOULD
- Placement SHOULD consider topology for communication-heavy workloads.
- Fabric upgrades SHOULD be staged by failure domain.

## Exceptions
Exceptions require workload evidence, blast-radius analysis, rollback, and approval.

## Verification
Inspect topology, telemetry, collective benchmarks, packet-loss data, routing policy, and staged rollout results.