# TLS and Certificate Operations

## Purpose
Operate HTTPS at CDN scale with correct certificates, protocol settings, origin encryption, and safe rotation.

## When to use
Use during hostname onboarding, certificate renewal, TLS hardening, or handshake incident response.

## Inputs
Hostnames, certificate sources, CAA records, TLS policy, origin certificates, client compatibility requirements.

## Context to inspect
Edge certificate automation, SNI, TLS versions, cipher policy, OCSP, HSTS, origin TLS validation, expiration alerts.

## Core knowledge
Edge TLS and origin TLS are separate trust boundaries. Automation must handle issuance, validation, renewal, deployment, and rollback without exposing private keys.

## Procedure
1. Inventory hostnames and certificate ownership.
2. Validate DNS control and CAA authorization.
3. Choose managed issuance unless constraints require custom certificates.
4. Enforce supported TLS versions and appropriate cipher suites.
5. Validate hostname coverage and chain completeness.
6. Configure strict TLS validation from CDN to origin.
7. Automate renewal and alert well before expiry.
8. Test SNI, redirects, HSTS, and representative legacy clients.
9. Document emergency rotation procedure.

## Decision points
Prefer provider-managed certificates for operational simplicity. Use custom keys only when compliance or PKI integration requires them. Enable HSTS only after HTTPS coverage is proven.

## Common failure patterns
Expired intermediates, incomplete SAN coverage, permissive origin validation, stale custom certificates, accidental HTTP origin fallback, and HSTS deployed before readiness.

## Verification
Run handshake checks from multiple regions, inspect chains and expiry, validate origin hostname verification, and test renewal in staging where possible.

## Expected output
A TLS policy, certificate lifecycle, origin-encryption model, monitoring, and verified hostname coverage.

## Stop conditions
Escalate on private-key exposure, certificate authority failures affecting production, or changes that could strand required client populations.