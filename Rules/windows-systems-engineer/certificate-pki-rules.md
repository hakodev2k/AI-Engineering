# Certificates and PKI

## Purpose
Prevent outages and trust failures caused by weak certificate lifecycle or unsafe PKI changes.

## Scope
Machine/user certificates, TLS, certificate stores, enrollment, templates, CAs, revocation, and private keys.

## MUST
- Certificates MUST have identified owner, purpose, trust chain, renewal path, and expiration monitoring for critical services.
- Private keys MUST be non-exportable where operationally appropriate and access-controlled to required principals.
- CA, template, trust-store, or revocation changes MUST assess enterprise-wide blast radius and require human approval when high impact.
- Renewal MUST be validated before expiry, including service binding where applicable.

## MUST NOT
- MUST NOT distribute private keys through insecure channels or source repositories.
- MUST NOT bypass certificate validation to resolve trust errors.
- MUST NOT deploy unreviewed broadly trusted roots.

## SHOULD
- Automate enrollment and renewal where supported.
- Use short-lived credentials when ecosystem support makes lifecycle reliable.

## Exceptions
Document reason, key exposure risk, duration, compensating controls, and approver.

## Verification
Inspect certificate chains, stores, ACLs, expiration, revocation endpoints, service bindings, TLS handshakes, and renewal tests.