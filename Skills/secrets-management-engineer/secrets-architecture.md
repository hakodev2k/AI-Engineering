# Secrets Architecture

## Purpose
Design a production-grade secrets-management architecture that centralizes trust, minimizes secret exposure, supports rotation, and remains operable during failures.

## When to use
Use when introducing or redesigning secret storage, distribution, encryption, or access across applications and infrastructure. Do not use for a single application credential change when the architecture is already defined.

## Inputs
- System and trust boundaries
- Workload inventory
- Identity model
- Secret types and owners
- Availability and compliance requirements

## Preconditions
Identify authoritative identity sources and the environments that consume secrets.

## Context to inspect
Inspect current vaults, CI/CD variables, cloud secret stores, application configuration, certificates, service accounts, encryption keys, replication, audit trails, and break-glass procedures.

## Core knowledge
Senior design requires separation of identities from secrets, least privilege, short-lived credentials, envelope encryption, high availability, disaster recovery, auditability, and minimizing plaintext materialization.

## Procedure
1. Map secret producers, stores, consumers, and trust boundaries.
2. Classify secrets by sensitivity, lifetime, blast radius, and rotation feasibility.
3. Prefer identity-based retrieval and dynamic credentials over static distribution.
4. Select authoritative stores and define replication boundaries.
5. Define authentication and authorization paths for every workload class.
6. Define encryption at rest and in transit, including key ownership.
7. Design rotation, revocation, lease expiry, and emergency disablement.
8. Define caching behavior and failure-mode expectations.
9. Add audit logging, health metrics, and administrative controls.
10. Validate backup, recovery, and regional failure behavior.
11. Document ownership and architectural decisions.

## Decision points
Choose centralized versus federated stores based on trust boundaries and failure isolation. Prefer dynamic secrets when dependencies support them; use static secrets only with explicit rotation controls. Replicate only when availability requirements justify larger exposure.

## Common failure patterns
- Treating environment variables as a complete secrets architecture
- Shared credentials across workloads
- Long-lived credentials without rotation ownership
- Circular dependency between secret store and workload startup
- Replication without revocation strategy
- Administrator access that bypasses audit controls

## Verification
Verify representative workloads can authenticate, retrieve only authorized material, survive expected store outages, rotate credentials without downtime, and produce complete audit evidence.

## Expected output
An architecture describing secret classes, stores, trust boundaries, access paths, rotation, resilience, and operational ownership.

## Stop conditions
Stop and escalate when trust ownership is unresolved, a design requires unaudited privileged access, or recovery requirements cannot be met without unacceptable secret exposure.