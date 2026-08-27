# Backup Strategy and Requirements

## Purpose
Translate business continuity needs into an implementable backup strategy with explicit scope, recovery objectives, retention, ownership, and evidence.

## When to use
Use when designing or reviewing backup protection for applications, databases, infrastructure, SaaS data, or critical configuration.

## Inputs
Business impact analysis, service inventory, data classification, dependencies, regulatory obligations, existing backup policies, RTO/RPO targets, and operational constraints.

## Context to inspect
Inspect authoritative inventories, architecture diagrams, data flows, dependency maps, current schedules, retention rules, restore history, and incident records. Do not assume every system needs identical protection.

## Core knowledge
RPO limits acceptable data loss; RTO limits acceptable restoration time. Backup frequency alone does not establish recoverability. A Senior engineer aligns protection tiers with business criticality, failure domains, compliance, cost, and restore complexity.

## Procedure
1. Identify services, datasets, configuration, identities, keys, and dependencies requiring protection.
2. Classify business criticality and data sensitivity.
3. Confirm RTO, RPO, retention, legal hold, and residency requirements.
4. Identify credible loss scenarios: deletion, corruption, ransomware, region loss, provider failure, and operator error.
5. Define backup method, frequency, retention, isolation, encryption, and replication for each tier.
6. Define restoration ordering and dependency prerequisites.
7. Assign operational ownership and escalation paths.
8. Define measurable restore tests and evidence retention.
9. Review cost and capacity implications.
10. Record exceptions and residual risks.

## Decision points
Prefer application-consistent backups when crash consistency cannot meet recovery requirements. Use multiple protection tiers when uniform policy wastes cost or fails critical workloads. Choose geographic copies only when correlated site or regional loss is in scope.

## Common failure patterns
Protecting data but not configuration or keys; undocumented RPO assumptions; retention shorter than discovery time; backups sharing the production failure domain; no restore testing; confusing replication with backup.

## Verification
Verify every critical asset maps to a policy, measured RPO/RTO is feasible, restore tests exist, retention is enforced, and exceptions have owners.

## Expected output
A traceable backup strategy tied to business requirements and testable recovery outcomes.

## Stop conditions
Escalate when business owners cannot define criticality, regulatory requirements conflict, required recovery targets are technically infeasible, or protection would require destructive production changes.