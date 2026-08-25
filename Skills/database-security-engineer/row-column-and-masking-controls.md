# Row, Column, and Masking Controls

## Purpose
Enforce fine-grained data visibility when database object-level permissions are insufficient.

## When to use
Use for multi-tenant data, sensitive columns, support tooling, analytics access, or least-privilege requirements within shared tables.

## Inputs
Access rules, identity context, schema, query patterns, database features, and performance requirements.

## Context to inspect
Inspect views, stored procedures, bypass roles, ownership semantics, connection pooling, session context, and reporting paths.

## Core knowledge
Row-level security restricts records; column controls restrict fields; masking changes presentation and is not always a security boundary. Privileged owners or bypass roles may circumvent policies.

## Procedure
1. Translate business authorization into explicit predicates.
2. Identify trusted identity attributes.
3. Choose native policies, secured views, or controlled procedures.
4. Minimize bypass principals.
5. Apply column restrictions or masking where appropriate.
6. Test pooled-session context isolation.
7. Benchmark representative queries.
8. Test positive, negative, cross-tenant, and privileged cases.

## Decision points
Prefer native row policies for centralized enforcement when semantics are clear. Use views when portability or query shaping matters. Do not use masking as a substitute for authorization unless the platform guarantees it as such.

## Common failure patterns
Tenant context leakage, policy recursion, owner bypass, ad hoc unprotected views, inference through aggregates, and severe predicate performance regressions.

## Verification
Run authorization matrices with multiple identities and inspect execution plans and bypass paths.

## Expected output
Fine-grained controls with tested isolation and acceptable performance.

## Stop conditions
Escalate when authorization rules are ambiguous or required policies cause unacceptable production performance.