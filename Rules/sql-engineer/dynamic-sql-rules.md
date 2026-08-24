# Dynamic SQL Rules

## Purpose
Use runtime-generated SQL without introducing injection, permission, correctness, or plan instability risks.

## Scope
Dynamic statements, metadata-driven queries, dynamic identifiers, and generated administrative SQL.

## MUST
- Data values MUST be parameterized whenever the database interface supports it.
- Dynamic identifiers MUST be validated against an allowlist or trusted metadata and quoted using engine-appropriate mechanisms.
- Generated SQL MUST preserve intended permissions and execution context.
- Complex generators MUST expose or log safe structural diagnostics sufficient for troubleshooting without leaking sensitive values.

## MUST NOT
- MUST NOT concatenate untrusted text into executable SQL.
- MUST NOT treat escaping alone as a substitute for parameterization of values.
- MUST NOT accept arbitrary object names, clauses, or operators from untrusted callers.

## SHOULD
- Prefer static SQL when requirements do not need runtime structure.
- Keep generated statement shapes stable where plan reuse is valuable.

## Exceptions
Any unavoidable raw fragment requires provenance, strict validation, threat analysis, tests, and security review for exposed paths.

## Verification
Run injection-focused tests, inspect generator inputs and quoting, review effective permissions, capture generated statement shapes, and test malicious boundary cases.