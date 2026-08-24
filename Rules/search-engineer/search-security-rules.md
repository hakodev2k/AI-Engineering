# Search Security

## Purpose
Prevent search infrastructure from exposing data or becoming an attack surface.

## Scope
Authorization, tenancy, query inputs, index access, administrative APIs, and sensitive content.

## MUST
- Enforce authorization and tenant isolation server-side for every retrieval path.
- Validate and bound user-controlled query syntax, regex, scripts, aggregations, and resource-intensive parameters.
- Protect administrative and index-management operations with least privilege and audited access.
- Treat indexed sensitive data according to the same or stronger classification controls as its source.

## MUST NOT
- Rely on post-filtering after unauthorized documents have been returned to an untrusted tier.
- expose credentials, tokens, private fields, or internal diagnostics in search responses.
- Disable security controls to recover relevance or performance.

## SHOULD
- Threat-model query abuse, enumeration, inference, and denial-of-service paths.
- Use separate privileges for read, ingest, and administration.

## Exceptions
Weakening a security boundary requires explicit human security approval, evidence, compensating controls, and time-bounded remediation.

## Verification
Use authorization tests, tenant-isolation tests, abuse/load tests, configuration review, secret scanning, and audit-log inspection.