# Row-Level Security

## Purpose
Implement PostgreSQL row-level security (RLS) policies that enforce data boundaries at the database layer without hidden authorization gaps.

## When to use
Use for tenant isolation or database-enforced row access policies. Avoid when simpler role/schema boundaries satisfy requirements.

## Inputs
Authorization rules, actor identity mapping, schema, query patterns, privileged roles.

## Context to inspect
Table ownership, BYPASSRLS roles, SECURITY DEFINER functions, connection pooling, session identity propagation and existing grants.

## Core knowledge
RLS policies filter rows for SELECT and constrain modifications through USING/WITH CHECK. Owners and privileged roles may bypass policies depending on configuration; identity propagation must be trustworthy.

## Procedure
1. Express access rules as explicit invariants.
2. Identify trusted database identity/context source.
3. Enable RLS on target tables.
4. Define minimal command-specific policies.
5. Cover INSERT/UPDATE with WITH CHECK.
6. Review owner/bypass paths.
7. Test joins, functions, views and pooled connections.
8. Benchmark policy predicates and indexes.
9. Add negative authorization tests.
10. Document operational debugging procedure.

## Decision points
Prefer explicit restrictive policy composition when independent constraints must all hold. Avoid complex policy logic that duplicates an entire application authorization engine.

## Common failure patterns
Testing only allowed rows, trusting client-set tenant IDs, owner bypass, missing WITH CHECK, policy predicates without indexes.

## Verification
Execute an actor-by-operation matrix proving both access and denial, including cross-tenant attempts.

## Expected output
Policies, identity assumptions, security tests, performance evidence.

## Stop conditions
Escalate if trusted identity propagation or bypass-role ownership cannot be guaranteed.