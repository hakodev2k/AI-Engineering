# Security and Authentication Rules

## Purpose
Protect RPC endpoints, credentials, identities, and transport confidentiality.

## Scope
TLS, mTLS, authentication metadata, credentials, interceptors, and service identity.

## MUST
- Production traffic carrying sensitive data MUST use authenticated encryption.
- Authentication MUST be validated before protected business logic executes.
- Service identities and credentials MUST follow least privilege and managed rotation.
- Credential-bearing metadata MUST be treated as sensitive.
- Certificate and trust-store failures MUST fail closed.

## MUST NOT
- MUST NOT hard-code credentials or disable certificate validation to unblock connectivity.
- MUST NOT log bearer tokens, private keys, session credentials, or sensitive authentication metadata.
- MUST NOT trust caller-supplied identity headers without an authenticated trust boundary.

## SHOULD
- Prefer workload identity and short-lived credentials over static secrets.
- Authentication policy SHOULD be centralized where practical while preserving method-specific requirements.

## Exceptions
Weakening transport or authentication controls requires explicit security approval, bounded scope, expiry, and compensating controls.

## Verification
Inspect channel/server credentials, certificate validation, auth interceptors, secret scans, negative authentication tests, and deployment configuration.