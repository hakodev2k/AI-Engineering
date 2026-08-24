# SQL Injection Defense Rules

## Purpose
Prevent untrusted input from changing database command structure or authorization intent.

## Scope
Covers application queries, stored procedures, dynamic SQL, reporting tools, administrative automation, and database APIs.

## MUST
- Untrusted values MUST be passed through parameterized interfaces or equivalently safe binding mechanisms.
- Dynamic identifiers or syntax that cannot be parameterized MUST use strict allowlists and controlled construction.
- Stored procedures MUST validate dynamic SQL boundaries and execute with the minimum required privilege.
- Security testing MUST include injection attempts on externally influenced query paths.

## MUST NOT
- User-controlled values MUST NOT be concatenated into executable SQL.
- Escaping alone MUST NOT be treated as the primary defense where parameterization is available.
- Elevated database permissions MUST NOT compensate for unsafe query construction.

## SHOULD
- Prefer APIs and query builders that make unsafe interpolation difficult.
- Static analysis and code review SHOULD flag raw SQL construction at trust boundaries.

## Exceptions
An unavoidable dynamic-query exception requires documented input grammar, allowlisting, tests, privilege analysis, and security review.

## Verification
Inspect query construction, ORM raw-query usage, stored procedures, static-analysis findings, database permissions, and penetration/integration tests. Confirm malicious payloads remain data rather than executable syntax.