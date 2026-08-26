# API Contract Protection

## Purpose
Prevent accidental breaking changes at the gateway boundary.

## Scope
HTTP methods, paths, headers, status codes, schemas, content types, and externally visible behavior.

## MUST
- Gateway transformations MUST preserve documented API semantics unless a versioned contract explicitly changes them.
- Contract changes MUST be assessed for existing clients and downstream services.
- Required headers, error formats, and content negotiation behavior MUST be tested end to end.
- Breaking public contract changes MUST require explicit human approval and a migration plan.

## MUST NOT
- MUST NOT rewrite payload semantics merely for gateway convenience.
- MUST NOT hide upstream incompatibility by returning misleading success responses.
- MUST NOT remove supported contract behavior without deprecation evidence.

## SHOULD
- Machine-readable contracts SHOULD drive compatibility tests where available.
- Deprecation SHOULD include measurable client-usage evidence.

## Exceptions
Exceptions require consumer impact analysis, reason, risk, migration or rollback plan, and approval.

## Verification
Run contract tests, schema diff checks, representative client tests, traffic analysis, and manual review of externally observable changes.