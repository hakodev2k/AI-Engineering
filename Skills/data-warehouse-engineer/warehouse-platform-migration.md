# Warehouse Platform Migration

## Purpose
Migrate analytical workloads between warehouse platforms, accounts, regions, or major architectural versions while preserving data correctness, security, performance, and consumer continuity.

## When to use
Use for cloud or engine migrations, account consolidation, regional moves, major warehouse redesigns, or retiring legacy analytical platforms.

## Inputs
Source and target platforms, schemas, workloads, data volumes, SLAs, security policies, integrations, migration deadline, rollback constraints.

## Context to inspect
SQL dialect differences, data types, identity and grants, ingestion paths, orchestration, BI connections, UDFs, stored procedures, materializations, query history, lineage, and cost profile.

## Core knowledge
A warehouse migration is not only data copy. Behavioral differences in SQL, nulls, timestamps, numeric precision, transactions, optimizer behavior, permissions, and workload management can change results. Dual-running and measurable reconciliation reduce cutover risk.

## Procedure
1. Inventory datasets, pipelines, consumers, integrations, and critical queries.
2. Classify incompatibilities in SQL, types, functions, security, and operational behavior.
3. Establish target architecture and migration waves by dependency and risk.
4. Build repeatable schema and data transfer processes.
5. Port transformations with compatibility tests.
6. Recreate access controls using least privilege.
7. Run representative workloads on the target and tune physical design.
8. Dual-run critical pipelines and reconcile row-level or aggregate outcomes.
9. Plan cutover, freeze windows, rollback criteria, and consumer connection changes.
10. Monitor post-cutover correctness, performance, cost, and residual legacy usage before decommissioning.

## Decision points
Use phased migration when dependency complexity or business criticality is high. Use a single cutover only when scope is small and rollback is fast. Refactor platform-specific logic when it materially improves target operation; otherwise minimize simultaneous change.

## Common failure patterns
Treating migration as bulk copy, ignoring timezone or precision differences, porting inefficient physical design unchanged, cutting over before consumer validation, and decommissioning before rollback windows close.

## Verification
Reconcile critical datasets, compare metric outputs, run performance baselines, test permissions, validate downstream integrations, and prove rollback or recovery procedures.

## Expected output
A phased migration plan and verified target warehouse with documented compatibility decisions, cutover evidence, and decommission criteria.

## Stop conditions
Stop cutover when reconciliation fails, critical consumers remain untested, rollback is unavailable, or security controls are not equivalent or stronger.