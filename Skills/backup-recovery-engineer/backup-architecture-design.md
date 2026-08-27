# Backup Architecture Design

## Purpose
Design resilient backup architecture across storage, compute, databases, and cloud services while separating protection systems from production failure domains.

## When to use
Use for new platforms, backup modernization, cloud migrations, or remediation after resilience reviews.

## Inputs
Workload topology, data volumes, change rates, recovery objectives, threat model, regions, storage capabilities, compliance requirements, and cost constraints.

## Context to inspect
Inspect production trust boundaries, accounts/subscriptions, regions, network paths, identity dependencies, backup service control planes, storage immutability options, and restore destinations.

## Core knowledge
A backup architecture must survive failures it is intended to recover from. Isolation, independent credentials, immutable retention, catalog availability, bandwidth, and restore-path capacity are first-class design concerns.

## Procedure
1. Enumerate protected assets and recovery scenarios.
2. Define trust and failure domains.
3. Select snapshot, image, log, file, or application-native protection mechanisms by workload.
4. Place backup copies outside relevant production blast radii.
5. Design encryption and key recovery.
6. Define immutable or deletion-protected tiers where required.
7. Size repository capacity, throughput, and growth.
8. Design metadata/catalog protection.
9. Define restore networks and clean recovery environments.
10. Add monitoring, audit logging, lifecycle policies, and restore testing.
11. Document dependency and failover assumptions.

## Decision points
Snapshots optimize speed but may share failure domains. Object storage improves durability but restore throughput must be tested. Cross-region copies reduce regional risk but increase cost and residency complexity.

## Common failure patterns
Single-account backups; backup credentials usable from compromised production; unprotected catalogs; insufficient restore bandwidth; architecture optimized only for backup ingestion.

## Verification
Run architecture threat review, capacity model, permission review, and representative restore tests from each required copy tier.

## Expected output
A documented architecture with failure-domain mapping, controls, capacity assumptions, and validated restore paths.

## Stop conditions
Stop for unresolved residency constraints, unavailable encryption/key design, insufficient isolation, or recovery architecture that cannot meet approved objectives.