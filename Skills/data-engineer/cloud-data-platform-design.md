# Cloud Data Platform Design

## Purpose
Design cloud data platforms with clear service boundaries, security, scalability, operability, and cost controls without overcoupling to one workload.

## When to use
Use for new platforms, major cloud migrations, platform consolidation, or architecture reviews spanning ingestion, storage, processing, orchestration, and serving.

## Inputs
Workload classes, data volumes, latency, regions, security requirements, team skills, cloud constraints, availability, and budget.

## Context to inspect
Inspect existing cloud services, identity model, network boundaries, storage, compute engines, catalogs, observability, CI/CD, quotas, and disaster recovery.

## Core knowledge
Prefer managed capabilities when they reduce undifferentiated operations without creating unacceptable lock-in or cost. Separate storage and compute when elasticity and workload isolation benefit. Design identity and governance as platform foundations.

## Procedure
1. Classify batch, streaming, interactive, and serving workloads.
2. Define data zones and ownership boundaries.
3. Choose durable storage and table abstractions.
4. Select compute engines by workload rather than standardizing blindly.
5. Establish identity, network, encryption, and secret patterns.
6. Define orchestration and metadata integration.
7. Add observability and cost attribution.
8. Plan environment isolation and infrastructure-as-code.
9. Define backup, recovery, and regional assumptions.
10. Validate architecture with representative workload tests.

## Decision points
Choose serverless for bursty workloads with acceptable service constraints; reserved or persistent compute for sustained predictable loads when economics favor it. Accept vendor-specific features when operational value exceeds portability requirements.

## Common failure patterns
One engine for every workload, public data paths by default, no cost attribution, unmanaged credentials, platform layers with unclear ownership, and architecture based only on service feature lists.

## Verification
Run workload prototypes, validate security boundaries, estimate steady and peak cost, test failure recovery, and confirm operational ownership.

## Expected output
A documented cloud data platform architecture with service rationale, security, cost, recovery, and operating model.

## Stop conditions
Escalate when regulatory residency, enterprise networking, or budget constraints require decisions outside the data team’s authority.