# Sensitive Data Caching

## Purpose
Minimize privacy, confidentiality, and compliance exposure created by cached copies.

## Scope
Personal, regulated, confidential, authentication-related, and tenant-scoped data.

## MUST
- Data classification MUST be considered before caching sensitive values.
- Cached sensitive data MUST have explicit retention, isolation, access, deletion, and incident-response behavior.
- Tenant-scoped data MUST include enforceable tenant isolation in keying and access paths.
- Required deletion or revocation workflows MUST account for all cache tiers.

## MUST NOT
- Secrets, raw authentication tokens, private keys, or equivalent credentials MUST NOT be cached unless the design explicitly requires it and approved protections exist.
- Sensitive values MUST NOT appear in diagnostics merely to improve cache debugging.
- A cache MUST NOT extend retention beyond applicable policy without approval.

## SHOULD
- Cache derived or minimized representations instead of raw sensitive records when sufficient.
- Use short retention for high-risk data.

## Exceptions
Require classification owner approval, documented necessity, threat analysis, retention bound, and verification.

## Verification
Review data-flow diagrams, key/value samples using safe tooling, deletion tests, access controls, retention configuration, and audit evidence.