# Web and API Security Research Rules

## Purpose
Make web and API security research accurate, authorization-aware, and safe for shared or production environments.

## Scope
Applies to HTTP services, browser applications, REST, GraphQL, RPC-over-HTTP, authentication flows, authorization boundaries, uploads, webhooks, and internet-facing APIs.

## MUST
- Tests MUST identify the exact identity, tenant, role, and resource boundary being evaluated.
- Authorization findings MUST demonstrate access or action beyond the tested principal's intended permission, not merely unusual responses.
- Request and response evidence MUST redact credentials, session tokens, personal data, and unrelated customer content.
- State-changing tests MUST use controlled records and define cleanup requirements.
- Injection, parser, upload, and callback tests MUST use payloads designed to minimize external effects while proving the security condition.
- Rate-sensitive endpoints MUST be tested within authorized traffic limits.
- Authentication findings MUST account for session lifecycle, token audience, expiry, revocation, and relevant browser or client protections.
- Business-logic findings MUST document the violated invariant and required sequence of actions.

## MUST NOT
- MUST NOT enumerate, modify, or download unrelated users' data to increase evidence volume.
- MUST NOT send callbacks to unapproved third-party infrastructure.
- MUST NOT treat differing status codes alone as proof of unauthorized data access.
- MUST NOT disable transport or browser security controls in production to simplify testing.
- MUST NOT run denial-of-service style tests without explicit authorization and operational safeguards.

## SHOULD
- Prefer dedicated test accounts representing realistic privilege boundaries.
- Test server-side enforcement independently from client-side controls.
- Examine API versioning, object ownership, mass assignment, pagination, idempotency, webhook verification, and error behavior where relevant.

## Exceptions
Testing that risks service degradation, real-user impact, or broad enumeration requires explicit human approval, a bounded test plan, monitoring, rollback or stop criteria, and owner coordination.

## Verification
Review captured transactions, identity mappings, tenant/resource ownership, cleanup evidence, server-side behavior, and application logs where available. Confirm every security conclusion follows from an observed boundary violation.