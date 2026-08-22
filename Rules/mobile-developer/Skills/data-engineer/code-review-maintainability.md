# Data Engineering Code Review and Maintainability

## Purpose
Review pipeline code, SQL, configuration, and infrastructure for correctness, operability, evolvability, and production risk.

## When to use
Use for pull requests and design changes affecting ingestion, transformations, orchestration, schemas, infrastructure, or data contracts.

## Inputs
Change diff, requirements, architecture, tests, execution plans, deployment method, and relevant production history.

## Context to inspect
Inspect surrounding conventions, downstream contracts, idempotency, error handling, observability, performance characteristics, security, and migration behavior.

## Core knowledge
A useful review prioritizes correctness and system risk over style. Data changes require special attention to historical behavior, retries, schemas, cardinality, state, and rollback because failures can persist in stored data.

## Procedure
1. Understand the intended behavior and affected data contracts.
2. Trace input-to-output semantics and grain.
3. Check retry, checkpoint, and idempotency behavior.
4. Review joins, filters, nulls, time boundaries, and deletes.
5. Inspect performance-sensitive scans, shuffles, and writes.
6. Check security and sensitive-data propagation.
7. Verify tests cover failure and historical cases.
8. Review deployment, backfill, and rollback implications.
9. Require observability for new failure modes.
10. Separate blocking correctness issues from optional improvements.

## Decision points
Request refactoring when complexity creates material operational or correctness risk; avoid blocking on stylistic preferences already handled by automation.

## Common failure patterns
Reviewing only changed lines, approving SQL without considering data distribution, missing backward compatibility, demanding abstractions with no reuse, and comments without severity or rationale.

## Verification
Confirm blocking concerns are resolved with code or evidence, tests exercise claimed behavior, and deployment/recovery steps are feasible.

## Expected output
Focused review feedback that reduces data and operational risk while preserving delivery velocity.

## Stop conditions
Escalate when the change affects unknown consumers, requires privileged production evidence, or risk acceptance exceeds reviewer authority.