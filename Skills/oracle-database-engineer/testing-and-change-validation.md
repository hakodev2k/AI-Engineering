# Testing and Change Validation

## Purpose
Validate Oracle schema, SQL, configuration, patch, and operational changes against correctness, performance, recoverability, and concurrency requirements before production.

## When to use
Use for every material database change, especially migrations, optimizer changes, indexing, patching, and recovery automation.

## Inputs
Change set, acceptance criteria, production workload characteristics, test data, baselines, rollback plan.

## Context to inspect
DDL/DML, dependencies, plans, statistics, representative data distributions, concurrent transactions, backup/recovery impact, HA/DR topology, and monitoring.

## Core knowledge
A database change can be functionally correct yet fail under production cardinality, concurrency, or recovery conditions. Validation must separate implemented from verified.

## Procedure
1. Define explicit functional and nonfunctional acceptance criteria.
2. Build representative data volumes and skew.
3. Test forward and rollback/compensating migration paths.
4. Validate object dependencies, grants, invalid objects, and jobs.
5. Run critical SQL and capture actual execution plans.
6. Exercise concurrent transactions and locking-sensitive paths.
7. Measure CPU, I/O, memory, redo, temp, and elapsed time.
8. Test HA/DR and backup implications when relevant.
9. Run negative/error-path tests.
10. Compare results with pre-change baseline and document residual risk.

## Decision points
Use workload replay or production-derived subsets when synthetic tests miss realistic behavior. Require staged rollout for changes with uncertain optimizer or contention impact.

## Common failure patterns
Testing tiny datasets, only compile/smoke tests, no rollback rehearsal, ignoring stats differences, and declaring success from implementation alone.

## Verification
Evidence must show acceptance criteria, regression metrics, and rollback readiness—not just successful deployment.

## Expected output
A change-validation report with pass/fail evidence and production gates.

## Stop conditions
Stop release when representative testing, rollback, or data-safety evidence is insufficient.