# mTLS Service Authentication

## Purpose
Design mutual TLS for APIs that need strong workload-to-workload identity, encrypted transport, and cryptographic proof that both peers possess trusted private keys.

## When to use
Use for service-to-service APIs, privileged partner integrations, zero-trust network boundaries, sensitive east-west traffic, or environments where bearer-token exposure is a significant concern.

## Inputs
PKI architecture, trust anchors, service identities, certificate profiles, mesh/proxy topology, rotation policy, revocation strategy, authorization requirements, deployment constraints.

## Preconditions
Know which component terminates TLS and whether the application, gateway, sidecar, or load balancer must consume the authenticated client identity.

## Context to inspect
Certificate issuance, SAN identities, EKU constraints, trust stores, private-key storage, termination hops, forwarded identity headers, expiry, rotation, revocation, clock synchronization, and direct-backend bypass paths.

## Core knowledge
mTLS authenticates certificate holders but does not automatically authorize business actions. Identity should be derived from validated certificate attributes, not caller-controlled headers. Short certificate lifetimes and automated rotation often provide more reliable compromise recovery than fragile revocation dependence.

## Procedure
1. Define workload identities and trust domains.
2. Select certificate authorities and issuance workflows.
3. Encode stable service identity in validated SANs rather than mutable display fields.
4. Require client and server certificate validation at intended trust boundaries.
5. Restrict accepted roots, algorithms, key sizes, and certificate purposes.
6. Protect private keys using platform-native secret or workload identity facilities.
7. Decide how authenticated identity is propagated after TLS termination.
8. Strip spoofable identity headers before adding trusted equivalents.
9. Map certificate identity to application authorization policy.
10. Automate renewal before expiry and test overlapping rotations.
11. Monitor handshake failures, expiry windows, and unexpected issuers.
12. Test untrusted roots, expired certificates, wrong SANs, revoked identities, and direct-backend access.

## Decision points
Terminate mTLS at a gateway when centralized certificate operations outweigh end-to-end identity requirements. Use mesh-level mTLS for broad east-west protection, but keep application authorization explicit. Prefer short-lived certificates when automation is mature.

## Common failure patterns
Trusting any corporate certificate, using CN parsing instead of validated SAN identity, forwarding client identity through spoofable headers, manual certificate rotation, treating mTLS as authorization, and leaving an unauthenticated backend route available.

## Verification
Test successful and failed handshakes across trust domains, certificate rotation, identity propagation, backend bypass resistance, and application authorization based on the authenticated workload identity.

## Expected output
A documented mTLS trust model with issuance, identity mapping, rotation, authorization integration, tests, and operational monitoring.

## Stop conditions
Escalate when PKI ownership is unclear, termination architecture destroys trustworthy client identity, certificate rotation cannot be automated, or required trust relationships are broader than acceptable risk.