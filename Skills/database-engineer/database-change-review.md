# Database Change Review

## Purpose
Review schema, query, configuration, and operational database changes for correctness, performance, security, and production risk before deployment.

## When to use
Use for pull requests, migration reviews, index changes, stored-code changes, configuration changes, and production runbooks.

## Inputs
Proposed change, rationale, schema, workload evidence, migration scripts, rollback plan, test results, and deployment context.

## Context to inspect
Inspect affected consumers, table sizes, transaction behavior, locks, replication, backups, permissions, observability, and previous related incidents.

## Core knowledge
Senior review focuses on failure modes and lifecycle impact, not formatting preferences. A logically correct change can still be unsafe because of locks, volume, concurrency, compatibility, or recovery gaps.

## Procedure
1. Confirm the business and technical objective.
2. Identify affected objects and consumers.
3. Review correctness and integrity implications.
4. Evaluate query plans and index effects where relevant.
5. Estimate lock, log, storage, and runtime impact at production scale.
6. Check transaction and concurrency behavior.
7. Review permissions and sensitive-data implications.
8. Verify backward/forward compatibility during deployment.
9. Require measurable validation and rollback criteria.
10. Record material trade-offs and operational instructions.

## Decision points
Approve simple low-risk changes with proportional evidence. Require staged rollout or rehearsal when volume, irreversibility, or availability risk is high.

## Common failure patterns
Reviewing only SQL syntax, ignoring production cardinality, accepting destructive migration because backups exist, and requesting abstractions unrelated to risk.

## Verification
Ensure tests and execution evidence address the identified risks and deployment observability can detect regression.

## Expected output
A risk-focused review with clear approval conditions, required changes, or escalation points.

## Stop conditions
Do not approve when critical production assumptions are unverified, rollback is impossible for unacceptable risk, or ownership is unclear.