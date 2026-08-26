# Streaming Security

## Purpose
Protect event platforms and data with least privilege, encryption, secure identities, and auditable access.

## When to use
Use for platform design, new producers/consumers, security reviews, or access incidents.

## Inputs
Data classifications, identities, topics, trust boundaries, network topology, compliance requirements.

## Context to inspect
Authentication, ACL/RBAC policy, TLS, secrets, service accounts, audit logs, schema-registry permissions.

## Core knowledge
Streaming systems widen data distribution. Controls must cover producers, consumers, brokers, connectors, registries, management APIs, and retained data.

## Procedure
1. Classify event data and trust boundaries.
2. Use workload identities rather than shared credentials.
3. Enforce TLS in transit and encryption at rest where required.
4. Grant least-privilege topic/group/schema permissions.
5. Separate administrative from application identities.
6. Protect and rotate secrets/certificates.
7. Restrict network exposure.
8. Audit sensitive access and configuration changes.
9. Test unauthorized publish/consume/admin attempts.

## Decision points
Prefer per-service identities; use field minimization/tokenization when broad event distribution conflicts with sensitive-data exposure.

## Common failure patterns
Shared broker credentials; wildcard ACLs; secrets in configs; plaintext internal traffic by assumption; PII copied to unnecessary topics.

## Verification
Access tests prove intended allow/deny behavior, encryption is active, and audit events are retrievable.

## Expected output
Threat-aware access model, controls, and verification evidence.

## Stop conditions
Escalate unresolved regulated-data handling or requests for excessive privilege.