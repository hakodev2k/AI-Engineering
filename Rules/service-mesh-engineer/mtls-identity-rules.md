# mTLS and Workload Identity
## Purpose
Protect east-west traffic with authenticated workload identities.
## Scope
mTLS, certificates, trust domains, workload identities, and peer authentication.
## MUST
- Production service identities MUST be cryptographically authenticated where the mesh supports it.
- Certificate issuance, rotation, expiry, and revocation behavior MUST be defined and monitored.
- Trust-domain changes MUST include compatibility and migration analysis.
## MUST NOT
- MUST NOT disable peer authentication merely to restore connectivity without explicit approval.
- MUST NOT share workload credentials between unrelated identities.
- MUST NOT log private keys or bearer credentials.
## SHOULD
- Strict mTLS SHOULD be the production default after migration readiness is proven.
## Exceptions
Any plaintext exception requires owner, reason, expiry, compensating controls, and security approval.
## Verification
Inspect mesh authentication policy, certificate state, handshake telemetry, identity mappings, and negative connectivity tests.