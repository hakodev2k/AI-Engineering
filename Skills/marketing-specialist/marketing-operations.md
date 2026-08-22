# Marketing Operations

## Purpose
Build reliable processes, data flows, tooling, governance, and handoffs that let marketing execute at scale with trustworthy measurement.

## When to use
Use when campaigns depend on multiple systems, lead or customer data moves across tools, reporting is inconsistent, automation grows, or operational errors create customer risk.

## Inputs
Marketing stack, CRM, analytics, campaign processes, data model, consent rules, integrations, SLAs, team responsibilities, and reporting requirements.

## Context to inspect
Inspect system ownership, field definitions, sync direction, identity keys, automation rules, permissions, failure alerts, duplicate records, naming standards, and manual workarounds.

## Core knowledge
Marketing operations is a socio-technical system. Automation magnifies both good and bad process. Data lineage, ownership, idempotency, observability, access control, and recovery procedures matter for customer-facing workflows.

## Procedure
1. Map critical marketing workflows end to end.
2. Identify systems of record and ownership boundaries.
3. Define shared field and lifecycle semantics.
4. Document integrations, triggers, dependencies, and failure behavior.
5. Remove unnecessary manual transfers and duplicate logic.
6. Add validation, deduplication, suppression, and permission controls.
7. Establish naming, tagging, and campaign taxonomy.
8. Add monitoring for failed syncs and abnormal volumes.
9. Create change-management and rollback procedures.
10. Test workflows with representative edge cases.
11. Maintain operational documentation and ownership.

## Decision points
Automate stable repeatable processes; keep human review for ambiguous or high-risk decisions. Prefer fewer authoritative systems over duplicated state when possible.

## Common failure patterns
Silent integration failures, circular syncs, inconsistent lifecycle stages, uncontrolled admin access, automating broken processes, no rollback, and reports built on undocumented transformations.

## Verification
Run end-to-end test records, reconcile systems, simulate failures, verify alerts and recovery, review permissions, and confirm reporting lineage.

## Expected output
Documented workflows, system ownership, data definitions, controls, monitoring, SLAs, and recovery procedures.

## Stop conditions
Stop changes when production data could be destructively altered, permissions are insufficient, or privacy and consent implications require approval.