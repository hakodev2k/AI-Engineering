# Backup and Recovery Design

## Purpose
Design recoverable backups that meet business RPO/RTO and survive logical corruption, deletion, infrastructure failure, and credential compromise.

## When to use
Use for new services, backup redesign, audits, ransomware resilience, or recovery gaps.

## Inputs
Data inventory, criticality, RPO/RTO, consistency requirements, retention, legal constraints, threat model, bandwidth, and restore dependencies.

## Preconditions
Identify authoritative datasets and application-consistent backup requirements.

## Context to inspect
Snapshots, backup agents, catalogs, encryption keys, offsite copies, immutability, replication, databases, identity systems, DNS/network dependencies, and prior restore tests.

## Core knowledge
A backup is useful only if restorable. Replication and snapshots can propagate deletion/corruption. Recovery requires data, metadata, keys, configuration, dependencies, procedures, and practiced operators.

## Procedure
1. Classify datasets and recovery objectives.
2. Choose backup mechanisms appropriate to consistency semantics.
3. Define independent failure and security domains.
4. Set retention and immutability.
5. Protect catalogs and encryption keys.
6. Estimate backup and restore throughput.
7. Define restore order and dependency graph.
8. Automate integrity checks.
9. Execute representative restore drills.
10. Measure achieved RPO/RTO and remediate gaps.

## Decision points
Use snapshots for fast local rollback where appropriate, but maintain independent backups for broader failure modes. Use application-aware backup when crash consistency is insufficient.

## Common failure patterns
Never testing restores, shared credentials across production and backup, inaccessible keys, incomplete metadata, retention misconfiguration, and assuming replicated corruption is recoverable.

## Verification
Restore selected and full datasets into isolated environments, verify application consistency and checksums, and measure recovery objectives.

## Expected output
A tested backup/recovery design with schedules, retention, isolation, restore runbooks, evidence, and ownership.

## Stop conditions
Escalate if recovery objectives are infeasible, backup copies share unacceptable failure domains, or restore tests could affect production.
