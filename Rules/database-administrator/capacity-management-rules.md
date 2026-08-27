# Capacity Management

## Purpose
Prevent predictable resource exhaustion and preserve headroom for failures and growth.

## Scope
Storage, IOPS, memory, CPU, connections, transaction logs, temp space, network, and replica capacity.

## MUST
- Critical resource consumption MUST be trended against growth and operational thresholds.
- Capacity plans MUST account for maintenance, failover, rebuild, backup, and peak-load conditions, not average load alone.
- Storage and log growth MUST have actionable thresholds before exhaustion.
- Capacity changes MUST be validated for bottleneck displacement.

## MUST NOT
- MUST NOT wait for resource exhaustion when sustained trend evidence predicts breach within the planning horizon.
- MUST NOT increase limits blindly when the underlying workload or leak is unknown.
- MUST NOT size replicas so tightly that normal failover violates service objectives.

## SHOULD
- Forecasts SHOULD include uncertainty and known business events.
- Connection capacity SHOULD be governed with pooling and workload limits where appropriate.

## Exceptions
Temporary reduced headroom requires documented risk, enhanced monitoring, owner, and remediation deadline.

## Verification
Review trend data, forecasts, peak utilization, failover capacity tests, storage growth, connection saturation, and remediation records.