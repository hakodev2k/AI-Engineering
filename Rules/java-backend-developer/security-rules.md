# Security Rules

## Purpose
Protect Java backend services against common application, dependency, and configuration threats.

## Scope
Applies to application code, libraries, runtime configuration, and service interfaces.

## MUST
- Untrusted input MUST be validated at trust boundaries and encoded or parameterized for its destination context.
- Authentication and authorization MUST fail closed and be enforced server-side.
- Secrets MUST come from approved secret-management mechanisms and remain out of source, logs, traces, and error responses.
- Sensitive data MUST have explicit handling, retention, access, and transport/storage protection requirements.
- Security-relevant dependencies MUST be tracked and patched according to risk.

## MUST NOT
- MUST NOT disable certificate validation, authorization, CSRF or equivalent protections merely to unblock implementation.
- MUST NOT deserialize untrusted data through unsafe polymorphic or native object mechanisms without a reviewed threat model.
- MUST NOT construct SQL, shell commands, templates, or paths from untrusted input without safe APIs and validation.

## SHOULD
- Apply least privilege, secure defaults, defense in depth, and auditable security decisions.
- Threat-model new trust boundaries and high-value flows.

## Exceptions
Weakening a security control requires explicit security-owner approval, documented compensating controls, expiry, and verification.

## Verification
Use code review, SAST, dependency scanning, DAST where appropriate, authorization tests, configuration inspection, secret scanning, and threat-model review.