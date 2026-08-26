# Certificates and PKI Operations

## Purpose
Operate Windows certificate dependencies safely across enrollment, stores, trust, renewal, private keys, and TLS service bindings.

## When to use
Use for certificate expiry, TLS failures, auto-enrollment, service certificate replacement, trust-chain issues, or Windows PKI operations.

## Inputs
Service names, certificate requirements, issuing CA, templates, SANs, EKUs, private-key requirements, renewal window, and trust distribution.

## Preconditions
Protect private keys and understand service binding/rollback before replacement.

## Context to inspect
Certificate stores, chain and revocation status, EKUs, SANs, key provider, private-key ACLs, template settings, auto-enrollment policy, service bindings, CA health, and time synchronization.

## Core knowledge
A valid date range alone does not make a certificate usable. Identity matching, EKU, chain trust, revocation, private-key presence/access, algorithm/key size, and service binding all matter. Renewal must account for overlapping deployment.

## Procedure
1. Identify the TLS/authentication purpose and names clients actually use.
2. Inspect current certificate, chain, private key, and binding.
3. Determine issuance/template requirements and renewal ownership.
4. Request/enroll using approved identity and key protection.
5. Validate SAN, EKU, chain, revocation, and private-key access before binding.
6. Stage the new certificate with overlap where possible.
7. Update service binding and restart/reload only as required.
8. Test from representative clients.
9. Remove superseded certificates only after dependency review.
10. Monitor expiry and renewal automation.

## Decision points
Use machine or service-managed keys according to workload identity. Prefer automated renewal for repeatable services, but require binding/reload automation to be equally reliable.

## Common failure patterns
Replacing certificates by thumbprint without dependency checks, missing SANs, private key absent, wrong EKU, deleting old cert too early, exporting keys insecurely, and assuming auto-enrollment updates application bindings.

## Verification
Verify chain/trust, revocation behavior, hostname match, private-key access, negotiated TLS, service health, and future renewal monitoring.

## Expected output
A trusted, correctly bound certificate lifecycle with protected keys.

## Stop conditions
Stop when private-key custody is unclear, CA/template changes affect broad populations, revocation infrastructure is unhealthy, or key export violates policy.