# Security Automation and SOAR

## Purpose
Automate repetitive security operations safely while preserving human judgment for ambiguous or high-impact decisions.

## When to use
Use for enrichment, deduplication, evidence collection, notification, ticketing and carefully bounded containment.

## Inputs
Workflow, trigger, APIs, permissions, failure modes, rate limits, approval requirements and rollback path.

## Context to inspect
Inspect identity model, API scopes, idempotency, retries, concurrency, secrets, audit logging and downstream dependencies.

## Core knowledge
Automation amplifies both good and bad decisions. High-impact actions require strong preconditions, least privilege, idempotency and observability.

## Procedure
1. Measure the manual workflow and error rate.
2. Separate deterministic steps from analyst judgment.
3. Define inputs, invariants and safe failure behavior.
4. Use least-privileged service identities.
5. Make actions idempotent where possible.
6. Bound retries and handle rate limits.
7. Add dry-run or approval gates for destructive actions.
8. Log inputs, decisions, API responses and actor identity.
9. Test success, partial failure and rollback scenarios.
10. Deploy gradually and monitor automation outcomes.
11. Maintain an owner and disable path.

## Decision points
Fully automate low-risk enrichment; require approval for account disablement, isolation or blocking when false positives can cause material outage.

## Common failure patterns
Infinite retries; broad admin tokens; hidden partial failures; duplicate tickets; automatic containment from a single weak signal; no kill switch.

## Verification
Run controlled test cases, prove idempotency, auditability, permission boundaries, failure handling and rollback.

## Expected output
A governed automation with tests, metrics, runbook, owner and safe operating boundaries.

## Stop conditions
Do not automate when action reversibility, authority, evidence threshold or failure impact is undefined.