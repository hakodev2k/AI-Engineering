# Workload Identity and mTLS

## Purpose
Design and verify cryptographic workload identity and mutual TLS across mesh traffic.

## When to use
Use for zero-trust rollout, certificate incidents, identity redesign, cross-cluster trust or authorization prerequisites.

## Inputs
Trust domains, workload identities, CA hierarchy, certificate TTLs, traffic map and compliance constraints.

## Context to inspect
Service accounts, identity issuance, SANs, trust bundles, rotation, peer-authentication policy, legacy plaintext dependencies and time synchronization.

## Core knowledge
mTLS authenticates peers and protects transport but does not by itself authorize business actions. Identity should be workload-bound, short-lived and automatically rotated. Trust-domain federation expands blast radius.

## Procedure
1. Define canonical workload identity semantics.
2. Map trust domains and CA ownership.
3. Inventory plaintext and externally terminated paths.
4. Configure issuance with least privilege.
5. Introduce permissive migration only when required and time-bound it.
6. Enforce strict mTLS after compatibility evidence.
7. Validate SAN and trust-bundle matching.
8. Test rotation, expiry, CA rollover and clock skew.
9. Monitor handshake failures and plaintext exceptions.
10. Document emergency revocation and recovery.

## Decision points
Use one trust domain for tightly governed environments; federate only when independent administration is required. Prefer strict mTLS; temporary permissive modes need explicit exit criteria.

## Common failure patterns
Confusing encryption with authorization, long-lived credentials, broad shared identity, hidden plaintext fallbacks, failed CA rollover and identity reuse across unrelated workloads.

## Verification
Capture peer identities, prove encryption on intended paths, test unauthorized identities, rotate certificates and confirm no outage.

## Expected output
A verified identity and mTLS design with migration and revocation procedures.

## Stop conditions
Stop on uncertain CA ownership, unverifiable identity mapping, or changes that could strand critical workloads.