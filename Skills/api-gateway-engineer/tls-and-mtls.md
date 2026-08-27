# TLS and mTLS

## Purpose
Secure client-to-gateway and gateway-to-backend transport with deliberate certificate, trust, and rotation controls.

## When to use
Use when terminating TLS, enabling backend TLS or mTLS, rotating certificates, or investigating handshake failures.

## Inputs
Trust domains, certificate sources, DNS names, protocol requirements, compliance constraints.

## Context to inspect
Current cipher/protocol policy, certificate chain, SANs, trust stores, rotation mechanism, backend verification settings.

## Core knowledge
Understand TLS termination, SNI, certificate chains, hostname verification, mTLS client identity, session reuse, protocol versions, and certificate rotation.

## Procedure
1. Map each encrypted hop and its trust boundary.
2. Define minimum TLS versions and approved cipher policy.
3. Configure hostname/SAN verification for upstream connections.
4. Define trusted CAs separately for public clients and internal workloads.
5. Automate issuance and rotation with overlap windows.
6. Protect private keys and restrict access.
7. Monitor certificate expiry and handshake errors.
8. Test rotation, revoked/untrusted chains, expired certs, and hostname mismatch.

## Decision points
Terminate at the gateway when L7 policy is required. Re-encrypt upstream whenever the internal network is not an explicit trusted boundary. Use mTLS where strong workload identity justifies certificate lifecycle complexity.

## Common failure patterns
Disabling hostname verification, shared client certs, manual rotation, overly broad trust stores, expired intermediates, plaintext upstream traffic by accident.

## Verification
Validate chains, protocol negotiation, hostname checks, mTLS identity mapping, and zero-downtime rotation.

## Expected output
A transport-security configuration with documented trust roots and automated lifecycle controls.

## Stop conditions
Escalate if private-key custody or trust ownership is unclear.