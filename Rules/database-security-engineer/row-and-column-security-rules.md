# Row and Column Security Rules

## Purpose
Enforce fine-grained data authorization when database consumers must see different subsets of shared data.

## Scope
Covers row-level security, column permissions, security views, tenant predicates, and policy functions.

## MUST
- Fine-grained policies MUST derive authorization from trusted identity/context, not user-controlled query values.
- Tenant or subject isolation MUST be enforced consistently across read and write operations.
- Policy bypass privileges MUST be narrowly assigned and audited.
- Security predicates MUST be tested for direct queries, joins, views, procedures, bulk paths, and administrative tooling where applicable.
- Default behavior for missing or invalid security context MUST fail closed.

## MUST NOT
- Application-side filtering MUST NOT be the sole isolation control when database-level enforcement is required by the threat model.
- Privileged ownership semantics MUST NOT accidentally bypass intended policies.
- New access paths MUST NOT assume existing row/column policies apply without verification.

## SHOULD
- Keep policy logic simple, deterministic, and performance-tested.
- Centralize reusable authorization predicates when this reduces inconsistency without creating excessive privilege.

## Exceptions
Exceptions require explicit affected principals/data, rationale, compensating controls, tests, monitoring, and approval.

## Verification
Run positive and negative authorization tests using representative identities; inspect effective policies, ownership, bypass privileges, query plans, and audit events.