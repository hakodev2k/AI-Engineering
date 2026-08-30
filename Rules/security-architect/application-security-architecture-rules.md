# Application Security Architecture Rules

## Purpose
Embed enforceable security controls into application architecture before implementation details harden.

## Scope
Web, mobile, API, backend, and service application architectures.

## MUST
- Security-sensitive input, output, identity, authorization, session, and error boundaries MUST be defined at architecture time.
- Untrusted input MUST be validated or safely encoded at the correct boundary for its use.
- Sensitive operations MUST have explicit authorization and audit requirements.
- Session and token designs MUST define lifetime, revocation, replay resistance, and storage expectations.
- Security-critical dependencies and frameworks MUST have supported lifecycle plans.

## MUST NOT
- MUST NOT depend on client-side validation for security enforcement.
- MUST NOT expose internal diagnostics or sensitive implementation details to untrusted callers.
- MUST NOT bypass framework security controls for convenience without reviewed compensating controls.

## SHOULD
- Prefer secure defaults, centralized security libraries, and narrow public interfaces.

## Exceptions
Require rationale, threat analysis, bounded scope, compensating controls, and approval.

## Verification
Review architecture diagrams, API contracts, authentication/authorization flows, security tests, dependency scans, and code-review evidence.