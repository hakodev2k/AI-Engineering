# Rightsizing Rules

## Purpose
Reduce persistent resource waste without compromising workload requirements.

## Scope
Compute, databases, storage, containers, serverless allocations, accelerators, and managed services.

## MUST
- Base rightsizing recommendations on representative utilization, demand patterns, performance requirements, and operational headroom.
- Identify workload owner, expected savings, technical risk, rollback path, and verification period before execution.
- Validate performance and reliability after material rightsizing changes.
- Require human approval for production changes unless an explicitly authorized automation policy exists.

## MUST NOT
- Downsize from average utilization alone when peaks, latency, memory, I/O, concurrency, or failover capacity are relevant.
- Treat provider recommendations as sufficient evidence without workload context.
- sacrifice documented SLOs or resilience requirements solely to reduce cost.

## SHOULD
- Prefer reversible changes and staged rollout for critical workloads.

## Exceptions
Emergency cost containment requires documented authority, impact assessment, and post-change validation.

## Verification
Review telemetry windows, recommendation calculations, approvals, change records, rollback readiness, and before/after cost plus service-level evidence.