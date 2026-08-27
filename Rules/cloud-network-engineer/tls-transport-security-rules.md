# TLS and Transport Security Rules

## Purpose
Protect data in transit and prevent insecure transport configurations.

## Scope
Applies to TLS termination, passthrough, internal encryption, certificates, protocol versions, and cipher policies.

## MUST
- Production traffic carrying sensitive data MUST use approved encrypted transport.
- TLS termination points and trust boundaries MUST be documented.
- Certificate ownership, renewal, and expiry monitoring MUST be defined for critical endpoints.
- Protocol and cipher policies MUST meet current organizational security requirements.
- Changes to transport security MUST include compatibility and rollback validation.

## MUST NOT
- MUST NOT disable certificate verification to bypass connectivity problems.
- MUST NOT use expired, self-signed, or weak certificates in production unless explicitly approved for a controlled use case.
- MUST NOT weaken TLS policy without security approval.

## SHOULD
- Prefer automated certificate lifecycle management.
- Prefer end-to-end encryption across untrusted or shared network segments.

## Exceptions
Exceptions require security review, bounded scope, documented risk, compensating controls, and approval.

## Verification
Inspect listener policies, certificate chains, expiry monitoring, protocol scans, and end-to-end connection tests.