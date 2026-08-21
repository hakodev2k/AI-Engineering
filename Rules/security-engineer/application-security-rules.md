# Application Security Rules

## Purpose
Define reusable controls for reducing exploitable application-layer weaknesses.

## Scope
Applies to web applications, services, APIs, background processors, and user-facing software.

## MUST
- Untrusted input MUST be validated according to expected type, format, range, and business constraints.
- Output encoding or safe rendering MUST match the destination context.
- Sensitive operations MUST enforce authorization at the trusted server boundary.
- Error responses MUST avoid exposing secrets, internal paths, stack traces, or sensitive implementation details.
- Security-sensitive state changes MUST include appropriate anti-forgery, replay, or integrity controls where applicable.

## MUST NOT
- MUST NOT concatenate untrusted data into executable queries, commands, templates, or interpretable expressions.
- MUST NOT assume client-side validation provides a security boundary.
- MUST NOT expose administrative or diagnostic endpoints without explicit access controls.

## SHOULD
- Prefer secure framework primitives over custom implementations.
- Prefer centralized validation and security middleware where it improves consistency.

## Exceptions
Exceptions require documented threat analysis, compensating controls, reviewer approval, and verification evidence.

## Verification
Use code review, static analysis, integration tests, security testing, dependency review, and manual assessment for high-risk flows.