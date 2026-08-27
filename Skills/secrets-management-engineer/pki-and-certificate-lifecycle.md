# PKI and Certificate Lifecycle

## Purpose
Operate certificate issuance, renewal, revocation, and trust distribution safely across services and infrastructure.

## When to use
Use for private PKI, service TLS, client certificates, mTLS, expiring certificates, or CA migrations.

## Inputs
- Certificate use cases
- Trust boundaries
- Names and identities
- Required validity periods
- CA hierarchy and policies

## Context to inspect
Inspect issuers, roots, intermediates, SAN requirements, key algorithms, renewal agents, revocation mechanisms, trust stores, and certificate dependencies.

## Core knowledge
Certificate lifecycle includes private-key protection, issuance constraints, identity proofing, chain construction, clock sensitivity, renewal overlap, revocation, and trust-anchor rollout.

## Procedure
1. Define certificate purpose and authenticated identity.
2. Select issuing hierarchy and allowed profiles.
3. Generate keys in the approved protection boundary.
4. Issue with minimal SANs, EKUs, and validity.
5. Distribute certificates and chains without exposing private keys.
6. Automate renewal before safe expiry thresholds.
7. Monitor expiry, issuance errors, and chain health.
8. Test trust across all client populations.
9. Revoke compromised certificates and replace them.
10. Plan CA rotation with overlapping trust anchors.

## Decision points
Use short-lived certificates when automation is reliable. Use HSM-backed or non-exportable keys for high-value identities. Prefer automated renewal over longer validity.

## Common failure patterns
- Private keys copied with certificates
- Missing intermediate certificates
- Expiry monitoring without renewal automation
- CA rollover that removes old trust too early
- Overbroad wildcard certificates

## Verification
Verify chain validation, intended identity matching, renewal, revocation behavior, expiry alerts, and old-trust removal after migration.

## Expected output
A tested certificate lifecycle with issuance policy, renewal, monitoring, revocation, and trust-rotation procedures.

## Stop conditions
Stop if identity proofing is inadequate, private-key custody is unclear, or trust-anchor changes could strand unmanaged clients.