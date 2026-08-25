# SQL Injection Defense

## Purpose
Prevent untrusted input from changing the structure or intent of database commands.

## When to use
Use during application review, stored-procedure design, dynamic reporting, incident response, or injection findings.

## Inputs
Query-building code, ORM usage, stored routines, API inputs, database permissions, and test cases.

## Context to inspect
Inspect raw SQL, dynamic identifiers, filters, sorting, bulk operations, administrative utilities, and stored dynamic SQL.

## Core knowledge
Parameterized values are the primary defense for data values. Identifiers usually cannot be parameterized and require strict allowlists. Least privilege reduces impact but does not fix injection.

## Procedure
1. Locate dynamic SQL construction.
2. Trace untrusted data into query text.
3. Replace value interpolation with bound parameters.
4. Constrain dynamic identifiers to explicit allowlists.
5. Remove unsafe escaping as a primary defense.
6. Limit database privileges of the calling identity.
7. Add negative tests for metacharacters, encoding, and boundary cases.
8. Review stored routines for secondary dynamic SQL.

## Decision points
Use ORM query APIs when they preserve parameterization and semantics. Raw SQL is acceptable when necessary and safely parameterized.

## Common failure patterns
String concatenation, parameterizing only some fields, unsafe ORDER BY identifiers, trusting internal inputs, and assuming stored procedures are automatically safe.

## Verification
Inspect generated SQL and bindings, run security tests, and confirm malicious inputs remain data rather than executable syntax.

## Expected output
Injection-resistant query paths plus regression tests and privilege containment.

## Stop conditions
Escalate immediately if evidence suggests active exploitation or if safe remediation requires incompatible API changes needing coordinated rollout.