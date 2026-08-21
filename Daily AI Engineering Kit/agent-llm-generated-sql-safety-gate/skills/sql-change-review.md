# SQL Change Review Skill

## Purpose
Review agent-generated write SQL before a human decides whether it may be executed.

## Inputs
SQL file, business intent, environment, affected schema, rollback/compensation plan, expected row scope.

## Preconditions
Write intent is explicit. Execution credentials are not available to the reviewing agent.

## Process
1. Confirm the business request actually requires mutation.
2. Identify statement types and affected objects.
3. Estimate row scope from predicates using a separately gated read-only count query where possible.
4. Check WHERE clauses, tenant/account boundaries, concurrency assumptions, constraints, triggers, and transaction behavior.
5. Run the static gate.
6. Reject any `blocked` result; do not edit policy to make it pass.
7. For `approval_required`, produce an approval packet: exact SQL hash/path, environment, expected rows, backup/rollback or compensation, verification query, and risks.
8. Human approval must identify the reviewed artifact and environment. Any material SQL change invalidates prior approval.
9. Execution, if authorized, must be performed by a separate controlled mechanism.
10. Verify postconditions with read-only queries and preserve evidence.

## Expected output
Status (`blocked`, `approval_required`, `verified`), affected objects, expected scope, gate evidence, approval evidence, post-verification.

## Verification
No write is represented as verified until approval exists and postconditions are checked. Static gate success alone is never execution proof.

## Failure handling
Unexpected row scope, trigger behavior, lock risk, or inability to construct verification query blocks execution and escalates.

## Stop conditions
Production write blocked by policy, destructive DDL, missing rollback/compensation, ambiguous tenant boundary, missing approval, or changed SQL after approval.
