# Dependency Capacity

## Purpose
Prevent upstream capacity plans from overwhelming downstream or third-party dependencies.

## Scope
Applies to internal services, shared platforms, external APIs, managed services, and vendor-operated dependencies.

## MUST
- Capacity plans MUST identify dependencies whose limits can constrain end-to-end throughput or recovery.
- Known rate, connection, concurrency, quota, payload, and throughput limits MUST be documented when material.
- Planned demand increases MUST be reviewed against dependency capacity before production rollout.
- Where a dependency cannot guarantee required capacity, the design MUST define throttling, buffering, degradation, or alternate handling.

## MUST NOT
- MUST NOT assume a dependency can absorb proportional load growth without evidence.
- MUST NOT retry capacity-related dependency failures in a way that amplifies overload.
- MUST NOT publish end-to-end capacity claims that exclude a known limiting dependency.

## SHOULD
- Maintain tested fallback or graceful-degradation paths for critical constrained dependencies.
- Revalidate external limits after contract, tier, architecture, or workload changes.

## Exceptions
Exceptions require documented uncertainty, risk, mitigation, and accountable approval.

## Verification
Inspect dependency inventories, service limits, contracts or documentation, load tests, retry policies, and production telemetry.
